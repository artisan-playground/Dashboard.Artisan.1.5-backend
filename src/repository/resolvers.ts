//Fake Database
const users = [
    {
      id: "1",
      name: "Pong",
    },
    {
      id: "2",
      name: "Pongpichat",
    },
    {
        id:"3",
        name:"Sumetha"
    },
  ];

  const me = users[2];

const resolvers = {
    Query: {
      me: (parent:any, args:any, context:any, info:any) => me,
      user: (parent:any, args:any, context:any, info:any) => {
          const id = args.id
          const user = users.find(user => user.id === id)

          return user

      },
      users: (parent:any, args:any, context:any, info:any) => users
    }
  };

export default resolvers;
