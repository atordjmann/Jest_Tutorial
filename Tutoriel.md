# Tester son Javascript avec Jest

## Présentation de Jest
### Jest qu'est ce que c'est ?
Jest est un framework de test javascript qui se concentre sur la simplicité. 

Le framework a été créé par les développeurs Facebook pour tester les projets React. Mais on peut l'utiliser avec des projets utilisant Babel, Typescript, Node, React, Angular, Vue...

### Pourquoi utiliser Jest ?
Jest offre une solution simple, rapide et efficace pour faire des tests unitaires dans un projet Javascript.
* Pas de configuration nécessaire: on peut utiliser Jest direction avec notre projet Javascript.
* Les tests peuvent garder facilement la trace des gros objets.
* Les tests sont mis en parallèles et exécutés dans des processus distincts afin d'augmenter les performances.
* Il est possible de mocker des objets facilement.
* En cas d'échec de test, Jest fourni un contexte riche.
* La documentation est riche et mise à jour régulièrement.

### Liens utiles
* Site web officiel de Jest : https://jestjs.io/
* Documentation officielle : https://jestjs.io/docs/en/getting-started
* Tuto sur le blog de Valentin Gagliardi : https://www.valentinog.com/blog/jest/
* Tuto de zetcode : http://zetcode.com/javascript/jest/

## Installation
Installer Jest avec [`yarn`](https://yarnpkg.com/en/package/jest):

```bash
yarn add --dev jest
```

Ou avec [`npm`](https://www.npmjs.com/):

```bash
npm install --save-dev jest
```
Un fichier de test est de la forme `nom_fichier.test.js`

Pour lancer les tests on utilise : `yarn test` ou `npm run test` après avoir configuré le fichier package.json avec :
```
{
  "scripts": {
    "test": "jest"
  }
}
```

## Quelques fonctionnalités principales

### Les "matchers" (voir https://jestjs.io/docs/en/expect)
Jest utilise les matchers pour tester les valeurs de façon différentes.

Par exemple pour tester une égalité, on utilisera le matcher "toBe()" : `expect(2 + 2).toBe(4)`.

Pour tester l'égalité d'un objet, on utilisera plutôt "toEqual()" : `expect(data).toEqual({one: 1, two: 2})`.

Pour tester la correspondance avec une expression régulière : `expect('Christoph').toMatch(/stop/)`.

Pour tester si on Array contient bien un élément : `expect(shoppingList).toContain('beer')`.

### Tester un code asynchrone : 
Une des particularités de javascript est la possibilité de faire du code asynchrone. 

Par exemple, si dans le même fichier on appelle une fonction qui récupère des données, et une fonction qui effectue une autre tâche, la deuxième fonction peut s'exécuter avant même que la première ait fini. Parfois cela peut être utile et offrir un gain de temps, mais si c'est mal utiliser cela peut causer quelques problèmes... Imaginons que la deuxième fonction remplit un tableau avec les données : aïe l'erreur console ! 

(Pour en savoir plus sur le code asynchrone : https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous).

Un exemple pour tester une fonction fetchData qui prend en argument une fonction callback :
```javascript
test('the data is peanut butter', done => {
  function callback(data) {
    expect(data).toBe('peanut butter');
    done();
  }

  fetchData(callback);
});
```
la fonction `done()` permet d'attendre que l'appel à callback soit effectué avant que fetchData soit executé.

Lorsque le code contient une promise, on peut utiliser `.then` dans un `return` : 
```javascript
return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
```  

### Configuration nécessaires avant ou après les tests.
Typiquement, lorsqu'on travaille avec une base de donnée (de test), on a besoin de l'initialiser avec de faire les tests. 

On peut vérifier qu'aucune donnée ne va corrompre nos tests, ou bien ajouter des données nécessaires initialement... Puis vider la base après les tests. Pour cela on utilise `beforeEach()' ou 'afterEach()' avant ou après chaque test.
Si on a besoin de faire quelque chose avant tout test, on peut utiliser `beforeAll()` et `afterAll()`
Par exemple : 
```javascript
beforeEach(() => {
  initializeCityDatabase();
});

afterEach(() => {
  clearCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});
```
Par défaut, ces blocks before et after s'appliquent à tous les tests. Pour restreindre leur utilisation à certains tests, il faut utiliser `describe`.
```javascript
describe('matching cities to foods', () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return initializeFoodDatabase();
  });

  test('Vienna <3 sausage', () => {
    expect(isValidCityFoodPair('Vienna', 'Wiener Schnitzel')).toBe(true);
  });

  test('San Juan <3 plantains', () => {
    expect(isValidCityFoodPair('San Juan', 'Mofongo')).toBe(true);
  });
});
```

### Mock
C'est la partie qui semble être la plus complexe avec Jest.

Parfois, il existe des dépendances dans notre code. Par exemple une classe qui appelle une autre classe, une fonction qui nécessite un module... 

Et pour tester une fonction qui contient des dépendances, il est important de simuler les dépendances, afin de s'assurer que le test que l'on effectue sur une fonction, ne dépende que de la dite fonction.

Les fonctions "Mock' permettent ainsi de tester les liens entre le code en effaçant l'implémentation réelle d'une fonction, en capturant les appels à la fonction (et les paramètres transmis dans ces appels), en capturant les instances des fonctions du constructeur lors de l'instanciation avec New et en permettant une configuration en temps de test des valeurs de retour.

Il existe deux manières de simuler des fonctions: soit en créant une fonction Mock à utiliser dans le code de test, soit en écrivant un Mock manuel pour remplacer une dépendance de module.

**Un exemple de mock de fonction:**
On a une fonction forEach qui prend en paramètre une liste, et un callback.
```javascript
function forEach(items, callback) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}
```
Pour tester la fonction forEach, on veut mocker la fonction de callback et s'assurer qu'elle est appelée comme il faut : 
```javascript
const mockCallback = jest.fn(x => 42 + x);
forEach([0, 1], mockCallback);

// The mock function is called twice
expect(mockCallback.mock.calls.length).toBe(2);

// The first argument of the first call to the function was 0
expect(mockCallback.mock.calls[0][0]).toBe(0);

// The first argument of the second call to the function was 1
expect(mockCallback.mock.calls[1][0]).toBe(1);

// The return value of the first call to the function was 42
expect(mockCallback.mock.results[0].value).toBe(42);
```
La propriété `.mock`, disponible pour toute fonction mock, permet d'obtenir des données à propos des appels de la fonction. Cela peut être utile pour vérifier comment la fonction est appelée, combien de fois, les valeurs retournées...

D'autres propriétés permettent de définir les valeurs de retour d'un fonction mock.
```javascript
const myMock = jest.fn();
```
`console.log(myMock());` renvoie undefined car la fonction n'est pas définie.
```javascript
myMock
  .mockReturnValueOnce(10)
  .mockReturnValueOnce('x')
  .mockReturnValue(true);
```
`console.log(myMock(), myMock(), myMock(), myMock());` renvoie 10, 'x', true, true. En effet on a mocké une fonction qui renvoie au premier appel 10, au deuxième appel 'x', et sinon true.

**Un exemple de mock de module**
Nous avons une classe Users qui renvoie des utilisateurs d'une API. Cette classe utilise le module **axios** pour appeler l'API et renvoyer les données.
```javascript
import axios from 'axios';

class Users {
  static all() {
    return axios.get('/users.json').then(resp => resp.data);
  }
}

export default Users;
```
Nous voulons tester notre classe sans réellement appeler l'API à l'aide de axios. Pour cela nous utilisons `jest.mock()` pour mocker le module axios.

```javascript
import axios from 'axios';
import Users from './users';

jest.mock('axios');

test('should fetch users', () => {
  const users = [{name: 'Bob'}];
  const resp = {data: users};
  axios.get.mockResolvedValue(resp);

  // or you could use the following depending on your use case:
  // axios.get.mockImplementation(() => Promise.resolve(resp))

  return Users.all().then(data => expect(data).toEqual(users));
});
```
Le mock est un sujet très vaste dans les tests. La documentation officielle fournit davantage d'exemples et de notions.

## Premier test avec Jest
Installer Jest dans un nouveau projet.

Un fichier package-lock.json ainsi qu'un dossier node_modules sont créés.

Créer un ficher `sum.js`:
```javascript
function sum(a, b) {
  return a + b;
}
module.exports = sum;
```

Puis créer un fichier `sum.test.js` qui contiendra notre test:
```javascript
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

**Que fait-on ici ?**

On importe notre fonction `sum`, puis au sein d'un test que l'on nomme 'Adds 1 + 2 to equel 3', on vérifie que la fonction sum avec les arguments 1 et 2 retourne 3. Avec `toBe` on vérifie que les deux valeurs (sum(1,2) et 3) sont strictement identiques. Il y a d'autres tests possibles que l'on verra plus tard ou qui sont détaillés dans la documentation officielle, dans la section [Using Matchers](https://jestjs.io/docs/en/using-matchers).*

**Attention**

Avant de voir si notre test passe ou pas, ajouter un fichier `package.json` avec pour contenu:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

Et maintenant lancer le test à l'aide de la commande `yarn test` ou `npm run test`.

Si tout va bien et que 1+2 vaut toujours 3, un message devrait apparaître comme celui-ci : 
```bash
PASS  ./sum.test.js
✓ adds 1 + 2 to equal 3 (5ms)
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        7.848s
Ran all test suites.
```

**TADAM!**

## Projet avec Jest
### Description du projet
Parce qu'il faut bien s'y coller à ces sacrés tests, je vous propose un petit projet rapide afin d'utiliser les principales fonctionnalités de Jest. Nous allons écrire un code javascript et le tester.

Nous allons utiliser des matchers, tester du code asynchrone, configurer et ranger nos tests et mocker un module. Nous aurons alors vu la majorité des fonctionnalités, tout en restant dans la simplicité. Nous pourrions aller beaucoup plus loin, mais faire quelques test sera déjà pas mal !

Ce que nous allons tester : 
* une fonction `createUser()` qui à partir des inputs de l'utilisateur, renvoie un objet JSON définissant l'utilisateur.
* une fonction `addUser()` qui ajoute un utilisateur dans la liste des personnes.
* une fonction `sortUser()` qui renvoie la liste des personnes triée selon leur âge.
* une fonction `rankUser()` qui renvoie le classement de l'utilisateur dans la liste triée.
* une fonction `getAllUsers()` qui renvoie la liste de tous les utilisateurs avec le module axios à l'adresse 'http://localhost:3000/users'

### Créer un utilisateur
**Créer un nouveau projet avec le module Jest (voir installation).**

**Note**

Ici on ne va écrire que du javascript. Les données ne sont pas persistées en base. Ainsi, si l'on refresh, les données sont perdues.

Dans un fichier `user.js` écrire une fonction createUser qui prend comme argument le prénom, le nom, l'âge, et renvoie un objet JSON de la forme:{"name":name, "surname":surname, "age":age}.

Puis dans un fichier `user.test.js` écrire un test qui vérifie le bon fonctionnement de la fonction.

Correction:

`user.js`

```javascript
const createUser = function(name, surname, age){
	return {"name":name, "surname":surname, "age":age};
}

module.exports  = {createUser}
```

`user.test.js`
```javascript
const {createUser} = require('./user');

test('create an user', () => {
	expect(createUser("John", "Doe", "21")).toEqual({"name":"John", "surname":"Doe", "age":"21"})
});
```
**Attention!**

Ici le matcher `.toBe()` renverra une erreur "Expected: {"age": "21", "name": "John", "surname": "Doe"}
    Received: serializes to the same string", car `.toBe` teste une égalité excate, ce qui n'est pas le cas lorsqu'on compare deux objets JSON.

### Ajouter un utilisateur
Dans le fichier `user.js` ajouter une fonction qui permet d'ajouter à une liste donnée un utilisateur sous le format JSON renvoyé par la fonction createUser.

Dans le fichier `user.test.js` écrire le test correspondant pour vérifier que l'utilisateur a été ajouté à la liste.

Correction:

`user.js`

```javascript
const addUser = function(jsonUser, userList){
	userList.push(jsonUser);
}

module.exports  = {createUser, addUser}
```

`user.test.js`
```javascript
const {createUser, addUser} = require('./user');
test('add an user to a list', () => {
	var userList = [];
	addUser({"name":"John", "surname":"Doe", "age":"21"},userList);
	expect(userList).toContainEqual({"name":"John", "surname":"Doe", "age":"21"})
});
```
**Attention**

Il faut utiliser `.toContainEqual` et pas seulement `.toContain()` car on vérifie que la liste contient un objet JSON : c'est un "mélange" entre `.toContain()` et `.toEqual()` qu'il faut utiliser.

### Classer les utilisateurs
Dans le fichier `user.js` ajouter une fonction `sortUser()` qui permet de classer les personnes selon leur âge dans une liste de personne telle que userList de la partie précédante. Ajouter également une fonction `rankUser()`qui donne le rang d'un utilisateur dans la liste.

Dans le fichier `user.test.js` écrire les tests correspondant pour vérifier que le tri et le classement se font correctement.

Correction:

J'utilise un tri par insertion pour trier ma liste d'utilisateurs.

`user.js`
```javascript
const sortUser = function(listUser){
	for(var i = 1; i < listUser.length; i++){
		var current = listUser[i];
		var j = i;
		while(j > 0 && (+listUser[j - 1].age > +current.age)){
			listUser[j] = listUser[j-1];
			j = j-1;
		}
		userList[j] = current;
	}
	return listUser;
}

const rankUser = function(user, userList){
	var sortedList = sortUser(userList);
	var index = sortedList.findIndex(x => x.name === user.name && x.surname === user.surname && x.age === user.age);
	if(index != -1){
		return userList.length - index
	}
	else{
	return - 1
	}
}
module.exports  = {createUser, addUser, sortUser, rankUser}
```

`user.test.js`
```javascript
const {createUser, addUser, sortUser, rankUser} = require('./user');
test('sort an userList', () => {
	var userList = [{"name":"John", "surname":"Doe", "age":"21"},
			{"name":"Pierre", "surname":"Martin", "age":"10"},
			{"name":"Paul", "surname":"Martin", "age":"45"},
			{"name":"Jack", "surname":"Martin", "age":"4"}];
	expect(sortUser(userList)).toMatchObject([{"name":"Jack", "surname":"Martin", "age":"4"},
			{"name":"Pierre", "surname":"Martin", "age":"10"},
			{"name":"John", "surname":"Doe", "age":"21"},
			{"name":"Paul", "surname":"Martin", "age":"45"}])
});
test('rank a user in userList', () => {
	var userList = [{"name":"John", "surname":"Doe", "age":"21"},
			{"name":"Pierre", "surname":"Martin", "age":"10"},
			{"name":"Paul", "surname":"Martin", "age":"45"},
			{"name":"Jack", "surname":"Martin", "age":"4"}];
	var user = {"name":"Pierre", "surname":"Martin", "age":"10"};
	expect(rankUser(user, userList)).toBe(3)
});
```
**Attention**

On compare les âges, il faut penser à les convertir de string à int, à l'aide d'un simple `+`. En effet javascript sait caster automatiquement une string d'entier en entier en le faisant précéder d'un `+`.

Aussi on utilisera ici comme matcher `.toMatchObject()` pour vérifier que le tableau d'objet est bien celui attendu.

### Compartimenter les tests
Dans le fichier `user.test.js` organiser les tests en deux parties à l'aide de describe. Une partie création/ajout d'utilisateur. Et une partie tri.

Puis, utiliser beforeAll() afin de remplir notre liste d'utilisateur si besoin, puis un afterAll() afin de la vider après nos tests.

`user.test.js`
```javascript
const {createUser, addUser, sortUser, rankUser} = require('./user');
describe('create and add users', () => {
	test('create an user', () => {
		expect(createUser("John", "Doe", "21")).toEqual({"name":"John", "surname":"Doe", "age":"21"})
	});
	test('add an user to a list', () => {
		var userList = [];
		addUser({"name":"John", "surname":"Doe", "age":"21"},userList);
		expect(userList).toContainEqual({"name":"John", "surname":"Doe", "age":"21"})
	});
});

describe('sort and rank users', () => {
	var userList = [];
	beforeEach(() =>{
		userList = [{"name":"John", "surname":"Doe", "age":"21"},
			{"name":"Pierre", "surname":"Martin", "age":"10"},
			{"name":"Paul", "surname":"Martin", "age":"45"},
			{"name":"Jack", "surname":"Martin", "age":"4"}];
	});
	afterEach(() => {
		userList = [];
	});
	test('sort an userList', () => {
		expect(sortUser(userList)).toMatchObject([{"name":"Jack", "surname":"Martin", "age":"4"},
			{"name":"Pierre", "surname":"Martin", "age":"10"},
			{"name":"John", "surname":"Doe", "age":"21"},
			{"name":"Paul", "surname":"Martin", "age":"45"}])
	});
	test('rank a user in userList', () => {
		var user = {"name":"Pierre", "surname":"Martin", "age":"10"};
		expect(rankUser(user, userList)).toBe(3)
	});

});

```
Si tout va bien, vous devriez obtenir le message :
```bash
 PASS  ./user.test.js
  create and add users
    √ create an user (21ms)
    √ add an user to a list (3ms)
  sort and rank users
    √ sort an userList (2ms)
    √ rank a user in userList (2ms)
```

### Mocker un utilisateur

Nous allons maintenant tester un code javascript qui utilise la librairie Axios.

Pour cela il faut installer les modules axios et json-server :

* `npm install axios` ou `yarn add axios`

* `npm install -g json-server` ou `yarn global add json-server ` 

Ensuite, créons quelques "fausses" données dans un fichier `users.json` :
```javascript
{
	"users": [
		{
			"id":1,
			"name": "John",
			"surname": "Doe",
			"age": "21"
		},
		{
			"id":2,
			"name": "Pierre",
			"surname": "Martin",
			"age": "10"
		},
		{
			"id":3,
			"name": "Paul",
			"surname": "Martin",
			"age": "45"
		},
		{
			"id":4,
			"name": "Jack",
			"surname": "Martin",
			"age": "4"
		}
	]
}
```
Créer une fonction `getAllUsers()` Users dans `users.js`
```javascript
const axios = require('axios');

async function getAllUsers(){
    let res = await axios.get('http://localhost:3000/users');
    return res;
}
```
Puis créer le fichier `users-app.js`dans lequel on définit la fonction pour afficher les données:
```javascript
const {getAllUsers} = require('./user');
async function showData() {
    let res = await getAllUsers();
    console.log(res.data);
}

showData();
console.log('finished')
```
Pour faire fonctionner cette fonction, dans une console écrire : 

`json-server --watch users.json ` pour démarrer le json-server,

Ouvrir un deuxième terminal et écrire:

`node users-app.js` pour lancer l'application, en s'assurant d'avoir le module `node` d'installé.

Dans la console devrait s'afficher : 

```
finished
[ { id: 1, name: 'John', surname: 'Doe', age: '21' },
  { id: 2, name: 'Pierre', surname: 'Martin', age: '10' },
  { id: 3, name: 'Paul', surname: 'Martin', age: '45' },
  { id: 4, name: 'Jack', surname: 'Martin', age: '4' } ]
```

Maintenant testons : 

`user.test.js`
```javascript
const axios = require('axios');
const {createUser, addUser, sortUser, rankUser, Users} = require('./user');

jest.mock('axios');

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

    const resp = { data : users };

    axios.get.mockImplementation(() => Promise.resolve(resp));

    Users.all().then(resp => expect(resp.data).toEqual(users));
});
```
**Attention**

Si en testant l'erreur suivante apparaît : "'jest' n’est pas reconnu en tant que commande interne ou externe, un programme exécutable ou un fichier de commandes.", il faut installer jest en **global**, soit `npm install -g jest` ou `yarn global add jest`.

**Et voilà !**

Avec `jest.mock('axios')` on mock le module, avec les constantes `users` et `resp` on définie la réponse que le module mocké devra retourner. 

Avec `axios.get.mockImplementation(() => Promise.resolve(resp));` on mock l'implémentation en renvoyant une promise avec la réponse.

Et enfin, avec `Users.all().then(resp => expect(resp.data).toEqual(users));` on teste la fonction Users.all() ainsi mockée.
