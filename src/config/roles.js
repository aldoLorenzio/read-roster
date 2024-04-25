const allRoles = {
  user: ['users', 'manageUsers'],
  admin: ['admin', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
