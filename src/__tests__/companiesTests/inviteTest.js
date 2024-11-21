require("dotenv").config();


const request = require('supertest');
const app = require('../../app');
const prisma = require('../../db.js'); 
const { EMAIL_TESTER } = process.env;

let companyId = 0;
let userId;
let auxUserId;
let companyEmail = "test@test.com";

let subscriptionPlanId = 4;
let token;

/* beforeAll:
1- Registrar usuario que va a ser el admin de la compañía
2- Registrar usuario que va a ser el usuario de la compañía
3- Crear una compañía
*/
beforeAll(async () => {
  const registrationData = {
    name: "Alice Smith",
    email: EMAIL_TESTER,
    password: "secureHashedPassword123",
    user_type: "individual"
  };

     await request(app)
    .post('/auth/register')
    .send(registrationData);

    const registrationDataAux = {
      name: "Alice Smith",
      email: "aux@email.com",
      password: "secureHashedPassword123",
      user_type: "individual"
    };
  
     await request(app)
      .post('/auth/register')
      .send(registrationDataAux);

    
      const auxuserData = await prisma.user.findUnique({
        where: {       email: "aux@email.com"},
        include: {
          VerificationCodes: true
        }
      })

      auxUserId = auxuserData.user_id;

const userData = await prisma.user.findUnique({
  where: {       email: EMAIL_TESTER},
  include: {
    VerificationCodes: true
  }
})


    const verificationData = {
      "user_id": userData.user_id,
      "verificationCode": userData.VerificationCodes[0].code
    }

    await request(app)
      .get('/auth/verificate-user')
      .send(verificationData);

      userId = userData.user_id;

          const verificationData2 = {
            "email": EMAIL_TESTER,
            "password": "secureHashedPassword123"
          }
      
          const response3 = await request(app)
            .post('/auth/login')
            .send(verificationData2);
      
          if (response3.status !== 200) {
            console.log('Response body:', response3.body);
          }
      
          token=response3.body.token;

          const companyData = {
            name: "Test company name",
            email: companyEmail,
            subscription_plan_id: subscriptionPlanId,
            user_id: userId
          };
      
          const companyResponse = await request(app)
            .post('/companies/create-company')
            .set('Authorization', `Bearer ${token}`)
            .send(companyData);

            const companyInviter = await prisma.company.findUnique({
              where: {       company_id: companyResponse._body.company.company_id},
              include: {
                users: true
              }
            })

           

companyId = companyInviter.company_id;




});



describe('Auth Endpoints', () => {
  it('fail create invitation;invited is the company admin; status 400 ', async () => {

    const invitationData = {
      email: EMAIL_TESTER,
      role:"manager",
      company_id: companyId,
      companyName: "uwuntu"
    };

    const response = await request(app)
      .post('/companies/invite')
      .set('Authorization', `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.message).toBe('This user is the administrator of this company.');
    expect(response.status).toBe(400);

  });
});

describe('Auth Endpoints', () => {
  it('success create invitation; status 200 ', async () => {

    const invitationData = {
      email: "exito@invited.com",
      role:"employee",
      company_id: companyId,
      companyName: "uwuntu"
    };

    const response = await request(app)
      .post('/companies/invite')
      .set('Authorization', `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 201) {
      console.log('Response body:', response.body);
    }
    expect(response.body.message).toBe('Invitation created successfully');
    expect(response.status).toBe(201);

  });
});

describe('Auth Endpoints', () => {
  it('fail create invitation;already pending invitation; status 400', async () => {

    const invitationData = {
      email: "exito@invited.com",
      role:"employee",
      company_id: companyId,
      companyName: "uwuntu"
    };

    const response = await request(app)
      .post('/companies/invite')
      .set('Authorization', `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.message).toBe('This email already has a pending invitation');
    expect(response.status).toBe(400);

  });
});

describe('Auth Endpoints', () => {
  it('fail create invitation ; already a member ; status 400', async () => {
  
await prisma.companyInvitation.updateMany({
  where: {
    company_id: companyId,
  },
  data: {
    active: false,
  },
});

    const invitationData = {
      email: "exito@invited.com",
      role:"employee",
      company_id: companyId,
      companyName: "uwuntu"
    };

    const response = await request(app)
      .post('/companies/invite')
      .set('Authorization', `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.message).toBe('This user is already part of this company');
    expect(response.status).toBe(400);

  });
});


describe('Auth Endpoints', () => {
  it('fail create invitation ; invited in last hour ; status 400', async () => {
  
await prisma.companyInvitation.updateMany({
  where: {
    email: "exito@invited.com",
  },
  data: {
    active: false,
  },
});

await prisma.user.update(
  {
    where: {
      email: "exito@invited.com",
    },
    data: {
      company_id: null,
    },
  }
)

    const invitationData = {
      email: "exito@invited.com",
      role:"employee",
      company_id: companyId,
      companyName: "uwuntu"
    };

    const response = await request(app)
      .post('/companies/invite')
      .set('Authorization', `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.message).toBe('This email has already been invited to this company within the last hour');
    expect(response.status).toBe(400);

  });
});


describe('Auth Endpoints', () => {
  it('fail create invitation ; invited in last hour ; status 400', async () => {
  
await prisma.companyInvitation.updateMany({
  where: {
    email: "exito@invited.com",
  },
  data: {
    active: false,
  },
});

await prisma.user.update(
  {
    where: {
      email: "exito@invited.com",
    },
    data: {
      company_id: null,
      role: "admin",
    },
  }
)

    const invitationData = {
      email: "exito@invited.com",
      role:"employee",
      company_id: companyId,
      companyName: "uwuntu"
    };

    const response = await request(app)
      .post('/companies/invite')
      .set('Authorization', `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.message).toBe('This user is the administrator of a company, you cant invite him to another company');
    expect(response.status).toBe(400);

  });
});


describe('Auth Endpoints', () => {
  it('fail create invitation; not logged in ;status 401 ', async () => {

    const invitationData = {
      role:"employee",
      company_id: companyId,
      companyName: "uwuntu"
    };

    const response = await request(app)
      .post('/companies/invite')
      .send(invitationData);

    if (response.status !== 401) {
      console.log('Response body:', response.body);
    }
    expect(response.body.message).toBe('Acceso denegado');
    expect(response.status).toBe(401);

  });
});


describe('Auth Endpoints', () => {
  it('fail create invitation; missing email;status 400 ', async () => {

    const invitationData = {
      email: undefined,
      role:"employee",
      company_id: companyId,
      companyName: "uwuntu"
    };

    const response = await request(app)
      .post('/companies/invite')
      .set('Authorization', `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.message).toBe('Email is required');
    expect(response.status).toBe(400);

  });
});

describe('Auth Endpoints', () => {
  it('fail create invitation; missing role;status 400 ', async () => {

    const invitationData = {
      email: "exito@invited.com",
      company_id: companyId,
      companyName: "uwuntu"
    };

    const response = await request(app)
      .post('/companies/invite')
      .set('Authorization', `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.message).toBe('All fields are required.');
    expect(response.status).toBe(400);

  });
});


describe('Auth Endpoints', () => {
  it('fail create invitation; missing role;status 400 ', async () => {

    const invitationData = {
      email: "exito@invited.com",
      role:undefined,
      company_id: companyId,
      companyName: "uwuntu"
    };

    const response = await request(app)
      .post('/companies/invite')
      .set('Authorization', `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.message).toBe('All fields are required.');
    expect(response.status).toBe(400);

  });
});


describe('Auth Endpoints', () => {
  it('fail create invitation; missing company_id;status 400 ', async () => {

    const invitationData = {
      email: "exito@invited.com",
      role:"employee",
      companyName: "uwuntu"
    };

    const response = await request(app)
      .post('/companies/invite')
      .set('Authorization', `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.message).toBe('All fields are required.');
    expect(response.status).toBe(400);

  });
});


describe('Auth Endpoints', () => {
  it('fail create invitation; missing companyName ;status 400 ', async () => {

    const invitationData = {
      email: "exito@invited.com",
      role:"employee",
      company_id: companyId
    };

    const response = await request(app)
      .post('/companies/invite')
      .set('Authorization', `Bearer ${token}`)
      .send(invitationData);

    if (response.status !== 400) {
      console.log('Response body:', response.body);
    }
    expect(response.body.message).toBe('All fields are required.');
    expect(response.status).toBe(400);

  });
});


// borrado de lo creado
afterAll(async () => {
  await prisma.verificationCode.deleteMany();
      await prisma.user.deleteMany();
      
      await prisma.companyInvitation.deleteMany();
      await prisma.company.deleteMany();
  
  await prisma.$disconnect(); // desconectarse de prisma, se cierra la conexión
});

