const prisma = require('../../db.js');

const getCompanyEmployeesController = async (data) => {

const requestingUser = await prisma.user.findUnique({
  where: {
    user_id: data.user_id,
  },
});

if(!requestingUser){
  return {status: 400, message: 'user does not exist'};
}

const requestedCompany = await prisma.company.findUnique({
  where: {
    company_id: data.company_id,
  },
  
    include: {
      users: {
        select: {
          user_id: true,
          name: true,
          email: true
        }
      }
    }
  
});

if(!requestedCompany){
  return {status: 400, message: 'company does not exist'};
}

if(requestedCompany.company_id !== requestingUser.company_id){
  return {status: 401, message: 'user is not a part of this company, admins have been informed of this incident(wip)'};
}

if(requestingUser.role !== 'admin' && requestingUser.role !== 'manager'){
  return {status: 401, message: 'user does not have permission, your manager has been informed of this incident(wip, add intructions to make the user a manager)'};
}



return {status: 200, message: requestedCompany.users};
}

module.exports = {
    getCompanyEmployeesController
}