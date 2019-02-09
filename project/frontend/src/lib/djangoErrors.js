export default data =>
  Object.keys(data).map(key => ({ message: `${key}: ${data[key]}` }));
