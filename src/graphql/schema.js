const schema = `
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
    books: [Book]
    author(id: ID!): Author  
    authors: [Author],
    getUserLogged: LoggedInUserPayload
}

type Token {
    token: String!
}

type Mutation {
    createAuthor(firstName: String!, lastName: String!,description: String,nationality: String!,file: Upload!): Author!
    deleteAuthor(id: ID!): ID!
    createBook(title: String!, description: String, authorId: ID!,file: Upload!): Book!
    deleteBook(id: ID!): ID!
    login(email: String!, password: String!): Token!
    singleUploadBook(file: Upload!): File!
}

type Subscription {
    newAuthor: Author
  }
`;
export default schema;