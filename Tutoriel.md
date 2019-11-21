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
### Installer Jest dans un projet
Installer Jest avec [`yarn`](https://yarnpkg.com/en/package/jest):

```bash
yarn add --dev jest
```

Ou avec [`npm`](https://www.npmjs.com/):

```bash
npm install --save-dev jest
```

### Quelques fonctionnalités principales

* Les "matchers" (voir https://jestjs.io/docs/en/expect)
Jest utilise les matchers pour tester les valeurs de façon différentes.
Par exemple pour tester une égalité, on utilisera le matcher "toBe()" : `expect(2 + 2).toBe(4)`.
Pour tester l'égalité d'un objet, on utilisera plutôt "toEqual()" : `expect(data).toEqual({one: 1, two: 2})`.
Pour tester la correspondance avec une expression régulière : `expect('Christoph').toMatch(/stop/)`.
Pour tester si on Array contient bien un élément : `expect(shoppingList).toContain('beer')`.

* Tester un code asynchrone : 
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

* Configuration nécessaires avant ou après les tests.
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

* Mock


### Premier test avec Jest
Ce premier test est issu de la documentation officielle.
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

*Que fait-on ici ?
On importe notre fonction `sum`, puis au sein d'un test que l'on nomme 'Adds 1 + 2 to equel 3', on vérifie que la fonction sum avec les arguments 1 et 2 retourne 3. Avec `toBe` on vérifie que les deux valeurs (sum(1,2) et 3) sont strictement identiques. Il y a d'autres tests possibles que l'on verra plus tard ou qui sont détaillés dans la documentation officielle, dans la section [Using Matchers](https://jestjs.io/docs/en/using-matchers).*

Avant de voir si notre test passe ou pas, ajouter ceci au fichier `package.json`:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

Et maintenant lancer le test à l'aide de la commande `yarn test` or `npm run test`.
Si tout va bien et que 1+2 vaut toujours 3, ce message devrait apparaître : 
```bash
PASS  ./sum.test.js
✓ adds 1 + 2 to equal 3 (5ms)
```

**TADAM!**

## Projet avec Jest
### Description du projet
Parce qu'il faut bien s'y coller à ces sacrés tests, je vous propose un petit projet rapide afin d'utiliser les principales fonctionnalités de Jest.
Nous allons utiliser des matchers, tester du code asynchrone, ranger nos tests et mocker des objets.
Nous allons écrire un code javascript destiné à une page web contenant deux fonctionnalités principales.
La première est l'ajout d'un utilisateur à une liste de personnes à l'aide d'inputs comme le nom, prénom, âge...
Après l'ajout de cet utilisateur, il sera possible d'afficher le classement de l'utilisateur au sein des autres personnes.

Dans un premier temps, nous n'écrirons que du javascript. Aucun HTML. La partie HTML est une partie "bonus" qui ne rentrera pas dans le cadre de Jest. Il serait possible de tester les vues afficher, et de faire des tests plus complexes en utilisant l'HTML, mais nous allons rester simples.
Ce que nous allons tester : 
* une fonction `createUser()` qui à partir des inputs de l'utilisateur, renvoie un objet JSON définissant l'utilisateur.
* une fonction `addUser()` qui ajoute un utilisateur dans la liste des personnes.
* une fonction `sortUser()` qui renvoie la liste des personnes triée selon , avec le rang du dernier utilisateur ajouté.

### Créer un utilisateur
**Note**: ici on ne va écrire que du javascript. Les données ne sont pas persistées en base. Ainsi, si l'on refresh, les données sont perdues.

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
	expect(createUser("John", "Doe", "21")).toBe({"name":"John", "surname":"Doe", "age":"21"})
});
```

### Ajouter un utilisateur
Dans le fichier `user.js` ajouter une fonction qui permet d'ajouter à une liste donnée un utilisateur sous le format JSON renvoyé par la fonction createUser.
Dans le fichier `user.test.js` écrire le test correspondant pour vérifier que l'utilisateur a été ajouté à la liste.

Correction:
`user.js`

```javascript
const createUser = function(name, surname, age){
	return {"name":name, "surname":surname, "age":age};
}

const addUser = function(jsonUser, userList){
	userList.append(jsonUser);
}

module.exports  = {userList, createUser, addUser}
```

`user.test.js`
```javascript
const {createUser, addUser} = require('./user');
test('create an user', () => {
	expect(createUser("John", "Doe", "21")).toBe({"name":"John", "surname":"Doe", "age":"21"})
});
test('add an user to a list', () => {
	var userList = [];
	addUser({"name":"John", "surname":"Doe", "age":"21"},userList);
	expect(userList).toContain({"name":"John", "surname":"Doe", "age":"21"})
});
```

### Classer l'utilisateur
Dans le fichier `user.js` ajouter une fonction qui permet de classer les personnes selon leur âge dans une liste de personne telle que userList de la partie précédante.
Dans le fichier `user.test.js` écrire le test correspondant pour vérifier que le tri se fait correctement.

### Compartimenter les tests
Dans le fichier `user.test.js` organiser les tests en deux parties à l'aide de describe. Une partie création/ajout d'utilisateur. Et une partie tri.
### Ajouter des données de test
Nous allons modifier un peu notre code. Désormais userList sera une variable globale non vide, comme si on récupérait cette liste d'une base de donnée. Dans notre test, nous allons utiliser beforeAll() afin de remplir notre liste, puis un afterAll() afin de la vider après nos tests.
Faire les modifications nécessaires.

### Mocker un utilisateur
