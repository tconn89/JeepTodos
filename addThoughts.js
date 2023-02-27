const { Client, authenticate } = require("./models/SheetsClient");

const main = async () => {
  const instance = await authenticate();
  console.log(instance);
  const jeep = new Client(instance);
  // jeep.addTodo('Nice work');
  // jeep.addTodo('Capacious work');
  // jeep.addTodo('Fantastic work');
  // jeep.addTodo('Code work');
  // jeep.addTodo('Competitive work');
  // jeep.addTodo('Cool work');
  // jeep.addTodo('Righteous work');
  // jeep.addTodo('Wonderful work');
  // jeep.addTodo('Total work');
  // jeep.addTodo('Magnificient work');

  jeep.addTodo("Go to Church");
  jeep.addTodo("Take Ollie for run");
  jeep.addTodo("Go to the Ymca kids zone");
  jeep.addTodo("Sign up for Recovery");
};

main();
