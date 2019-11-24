const {
    createUser,
    addUser,
    sortUser,
    rankUser,
    getAllUsers
} = require('./user');
const axios = require('axios');
jest.mock('axios');
describe('create and add users', () => {
    test('create an user', () => {
        expect(createUser("John", "Doe", "21")).toEqual({
            "name": "John",
            "surname": "Doe",
            "age": "21"
        })
    });
    test('add an user to a list', () => {
        var userList = [];
        addUser({
            "name": "John",
            "surname": "Doe",
            "age": "21"
        }, userList);
        expect(userList).toContainEqual({
            "name": "John",
            "surname": "Doe",
            "age": "21"
        })
    });
});

describe('sort and rank users', () => {
    var userList = [];
    beforeEach(() => {
        userList = [{
                "name": "John",
                "surname": "Doe",
                "age": "21"
            },
            {
                "name": "Pierre",
                "surname": "Martin",
                "age": "10"
            },
            {
                "name": "Paul",
                "surname": "Martin",
                "age": "45"
            },
            {
                "name": "Jack",
                "surname": "Martin",
                "age": "4"
            }
        ];
    });
    afterEach(() => {
        userList = [];
    });
    test('sort an userList', () => {
        expect(sortUser(userList)).toMatchObject([{
                "name": "Jack",
                "surname": "Martin",
                "age": "4"
            },
            {
                "name": "Pierre",
                "surname": "Martin",
                "age": "10"
            },
            {
                "name": "John",
                "surname": "Doe",
                "age": "21"
            },
            {
                "name": "Paul",
                "surname": "Martin",
                "age": "45"
            }
        ])
    });
    test('rank a user in userList', () => {
        var user = {
            "name": "Pierre",
            "surname": "Martin",
            "age": "10"
        };
        expect(rankUser(user, userList)).toBe(3)
    });

});

describe('fetc users', () => {


    test('should fetch users', () => {

        const users = [{
            "id": 1,
            "first_name": "Robert",
            "last_name": "Schwartz",
            "age": "18"
        }, {
            "id": 2,
            "first_name": "Lucy",
            "last_name": "Ballmer",
            "age": "68"
        }];

        const resp = {
            data: users
        };

        axios.get.mockImplementation(() => Promise.resolve(resp));

        getAllUsers().then(resp => expect(resp.data).toEqual(users));
    });
})