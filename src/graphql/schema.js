const schema = `
scalar Upload

type Author {
    id: ID! 
    firstName: String
    lastName: String
    description: String
    image: String
    nationality: String
    books: [Book] 
}

type File {
  id: ID!
  path: String!
  filename: String!
  mimetype: String!
}

type Book {
    id: ID! 
    title: String
    description: String
    author: Author
    image: String
}

type LoggedInUserPayload {
    email: String
  }

type Query { 
    book(id: ID!): Book
    books(limit: Int, offset: Int): [Book]
    author(id: ID!): Author  
    authors(limit: Int, offset: Int): [Author],
    getUserLogged: LoggedInUserPayload
}

type Token {
    token: String!
}

type Mutation {
    createAuthor(firstName: String!, lastName: String!,description: String,nationality: String!,file: Upload): Author!
    editAuthor(id: ID!,firstName: String!, lastName: String!,description: String,nationality: String!,file: Upload): Author!
    deleteAuthor(id: ID!): ID!
    createBook(title: String!, description: String, authorId: ID!,file: Upload): Book!
    editBook(id: ID!,title: String!, description: String, authorId: ID!,file: Upload): Book!
    deleteBook(id: ID!): ID!
    login(email: String!, password: String!): Token!
}

type Subscription {
    newAuthor: Author
  }
`;
export default schema;