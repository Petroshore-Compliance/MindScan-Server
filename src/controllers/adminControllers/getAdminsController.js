const prisma = require('../../db.js');

// Devuelve todos los perfiles de los petroAdmins sin el password
const getAdminsController = async (data) => {

    if (data.petroAdmin_id) {

        const petroAdmin = await prisma.petroAdmin.findUnique({
            where: { petroAdmin_id: data.petroAdmin_id },

        })

        if (!petroAdmin) {
            return { status: 404, message: 'petroAdmin not found' };
        }

        const { password, ...petroAdminData } = petroAdmin;
        return { status: 200, message: 'petroAdmin found', petroAdmin: petroAdminData };
    }

    const petroAdmins = await prisma.petroAdmin.findMany();

    if (!petroAdmins || petroAdmins.length === 0) {
        return { status: 404, message: 'petroAdmins not found' };
    }

    // Remove passwords from all admins
    const petroAdminsData = petroAdmins.map(({ password, ...adminData }) => adminData);

    return { status: 200, message: 'petroAdmins found', petroAdmins: petroAdminsData };
};

module.exports = { getAdminsController };