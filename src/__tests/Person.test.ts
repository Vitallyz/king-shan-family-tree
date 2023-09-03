import Person from '../data/Person';

describe('Person', () => {
  let person: Person;

  beforeEach(() => {
    person = new Person('John', 'male');
  });

  it('should create a person instance with the correct name and gender', () => {
    expect(person.getName()).toBe('John');
    expect(person.getGender()).toBe('male');
  });

  it('should set and get spouse', () => {
    const spouse = new Person('Jane', 'female');
    person.setSpose(spouse);
    expect(person.getSpose()).toBe(spouse);
  });

  it('should add and get parents', () => {
    const mother = new Person('Mary', 'female');
    const father = new Person('David', 'male');

    person.addParent(mother);
    person.addParent(father);

    expect(person.getParents()).toEqual([mother, father]);
    expect(person.getMother()).toEqual([mother]);
    expect(person.getFather()).toEqual([father]);
  });

  it('should add and get children', () => {
    const child1 = new Person('Alice', 'female');
    const child2 = new Person('Bob', 'male');

    person.addChild(child1);
    person.addChild(child2);

    expect(person.getChildren()).toEqual([child1, child2]);
    expect(person.getDaughters()).toEqual([child1]);
    expect(person.getSons()).toEqual([child2]);
  });

  it('should get an empty array for spouse, parents, children, daughters, and sons if not set', () => {
    expect(person.getSpose()).toBeNull();
    expect(person.getParents()).toEqual([]);
    expect(person.getMother()).toEqual([]);
    expect(person.getFather()).toEqual([]);
    expect(person.getChildren()).toEqual([]);
    expect(person.getDaughters()).toEqual([]);
    expect(person.getSons()).toEqual([]);
  });
});
