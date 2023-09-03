import FamilyTree from '../data/FamilyTree';
import Person from '../data/Person';
import { familyData } from './testData/family-data';

describe('FamilyTree', () => {
  let familyTree: FamilyTree;
  let person1: Person;
  let person2: Person;
  let person3: Person;

  beforeEach(() => {
    familyTree = new FamilyTree();
    person1 = new Person('John', 'male');
    person2 = new Person('Alice', 'female');
    person3 = new Person('Bob', 'male');
  });

  it('should initialize with an empty members array', () => {
    expect(familyTree.getAllMembersNames()).toEqual([]);
  });

  describe('addMember', () => {
    it('should add a member to the family tree', () => {
      familyTree.addMember(person1);
      familyTree.addMember(person2);

      expect(familyTree.findMember('John')).toBe(person1);
      expect(familyTree.findMember('Alice')).toBe(person2);
    });
  });

  describe('findMember', () => {
    it('should find a member by name', () => {
      familyTree.addMember(person1);
      familyTree.addMember(person2);

      expect(familyTree.findMember('John')).toBe(person1);
      expect(familyTree.findMember('Alice')).toBe(person2);
    });

    it('should return undefined when finding a non-existent member', () => {
      expect(familyTree.findMember('Nonexistent')).toBeUndefined();
    });
  });

  describe('getAllMembersNames', () => {
    it("should return an array of all members' names", () => {
      familyTree.addMember(person1);
      familyTree.addMember(person2);
      familyTree.addMember(person3);

      expect(familyTree.getAllMembersNames()).toEqual(['John', 'Alice', 'Bob']);
    });
  });

  describe('getMembersByRelationship', () => {
    it('should get members by relationship - Father', () => {
      person2.addParent(person1);
      familyTree.addMember(person1);
      familyTree.addMember(person2);

      expect(familyTree.getMembersByRelationship('Alice', 'Father')).toEqual([
        person1,
      ]);
    });

    it('should get members by relationship - Sons', () => {
      familyTree.addMember(person1);
      familyTree.addMember(person2);
      familyTree.addMember(person3);
      person1.addChild(person2);
      person1.addChild(person3);

      expect(familyTree.getMembersByRelationship('John', 'Sons')).toEqual([
        person3,
      ]);
    });

    it('should get members by relationship - Dauthers', () => {
      familyTree.addMember(person1);
      familyTree.addMember(person2);
      familyTree.addMember(person3);
      person1.addChild(person2);
      person1.addChild(person3);

      expect(familyTree.getMembersByRelationship('John', 'Daughters')).toEqual([
        person2,
      ]);
    });

    // Optionally add more tests for other relationships here
    // Skipping those as other relationships are tested using familyData array in the next test
  });

  describe('buildFromFamilyData', () => {
    it('should build the family tree from family data', () => {
      const data = familyData;

      familyTree.buildFromFamilyData(data);

      expect(familyTree.getAllMembersNames()).toEqual([
        'King Shan',
        'Queen Anga',
        'Ish',
        'Chit',
        'Vich',
        'Satya',
        'Ambi',
        'Lika',
        'Vyan',
        'Drita',
        'Jaya',
        'Vrita',
        'Vila',
        'Jnki',
        'Chika',
        'Satvy',
        'Asva',
        'Savya',
        'Krpi',
        'Saayan',
        'Mina',
        'Jata',
        'Driya',
        'Lavnya',
        'Gru',
        'Kriya',
        'Misa',
      ]);
    });
  });
});

describe('Family Tree Realationships', () => {
  let familyTree: FamilyTree;
  beforeEach(() => {
    familyTree = new FamilyTree();
    const data = familyData;
    familyTree.buildFromFamilyData(data);
  });

  it('should be able to find father if any exist on record', () => {
    expect(familyTree.getMembersByRelationship('Chit', 'Father')).toEqual([
      familyTree.findMember('King Shan'),
    ]);
    expect(familyTree.getMembersByRelationship('King Shan', 'Father')).toEqual(
      []
    );
  });

  it('should be able to find mother if any exist on record', () => {
    expect(familyTree.getMembersByRelationship('Chit', 'Mother')).toEqual([
      familyTree.findMember('Queen Anga'),
    ]);
    expect(familyTree.getMembersByRelationship('King Shan', 'Mother')).toEqual(
      []
    );
  });

  it('should be able to find children if any exist on record', () => {
    expect(
      familyTree.getMembersByRelationship('King Shan', 'Children')
    ).toEqual([
      familyTree.findMember('Ish'),
      familyTree.findMember('Chit'),
      familyTree.findMember('Vich'),
      familyTree.findMember('Satya'),
    ]);
    expect(familyTree.getMembersByRelationship('Jata', 'Children')).toEqual([]);
  });

  it('should be able to find sons if any exist on record', () => {
    expect(familyTree.getMembersByRelationship('King Shan', 'Sons')).toEqual([
      familyTree.findMember('Ish'),
      familyTree.findMember('Chit'),
      familyTree.findMember('Vich'),
    ]);
    expect(familyTree.getMembersByRelationship('Vila', 'Sons')).toEqual([]);
  });

  it('should be able to find daughters if any exist on record', () => {
    expect(
      familyTree.getMembersByRelationship('King Shan', 'Daughters')
    ).toEqual([familyTree.findMember('Satya')]);
    expect(familyTree.getMembersByRelationship('Chit', 'Daughters')).toEqual(
      []
    );
  });

  it('should be able to find brothers if any exist on record', () => {
    expect(familyTree.getMembersByRelationship('Ish', 'Brothers')).toEqual([
      familyTree.findMember('Chit'),
      familyTree.findMember('Vich'),
    ]);
    expect(familyTree.getMembersByRelationship('Vila', 'Brothers')).toEqual([]);
  });

  it('should be able to find sisters if any exist on record', () => {
    expect(familyTree.getMembersByRelationship('Ish', 'Sisters')).toEqual([
      familyTree.findMember('Satya'),
    ]);
    expect(familyTree.getMembersByRelationship('Driya', 'Sisters')).toEqual([]);
  });

  it('should be able to find granddaughters if any exist on record', () => {
    expect(
      familyTree.getMembersByRelationship('King Shan', 'Granddaughters')
    ).toEqual([familyTree.findMember('Chika'), familyTree.findMember('Satvy')]);
    expect(
      familyTree.getMembersByRelationship('Satya', 'Granddaughters')
    ).toEqual([]);
  });

  it('should be able to find grandsons if any exist on record', () => {
    expect(
      familyTree.getMembersByRelationship('King Shan', 'Grandsons')
    ).toEqual([
      familyTree.findMember('Drita'),
      familyTree.findMember('Vrita'),
      familyTree.findMember('Vila'),
      familyTree.findMember('Savya'),
      familyTree.findMember('Saayan'),
    ]);
    expect(familyTree.getMembersByRelationship('Lika', 'Grandsons')).toEqual(
      []
    );
  });

  it('should be able to find paternal uncles if any exist on record', () => {
    expect(
      familyTree.getMembersByRelationship('Driya', 'Paternal uncles')
    ).toEqual([familyTree.findMember('Vrita')]);
    expect(
      familyTree.getMembersByRelationship('Satya', 'Paternal uncles')
    ).toEqual([]);
  });

  it('should be able to find maternal uncles if any exist on record', () => {
    expect(
      familyTree.getMembersByRelationship('Satvy', 'Maternal uncles')
    ).toEqual([
      familyTree.findMember('Ish'),
      familyTree.findMember('Chit'),
      familyTree.findMember('Vich'),
    ]);
    expect(
      familyTree.getMembersByRelationship('Satya', 'Maternal uncles')
    ).toEqual([]);
  });

  it('should be able to find paternal aunts if any exist on record', () => {
    expect(
      familyTree.getMembersByRelationship('Vila', 'Paternal aunts')
    ).toEqual([familyTree.findMember('Satya')]);
    expect(
      familyTree.getMembersByRelationship('Driya', 'Paternal aunts')
    ).toEqual([]);
  });

  it('should be able to find maternal aunts if any exist on record', () => {
    // current femily tree data set does not have any person that have a maternal aunt (no sisters with dauters)
    expect(
      familyTree.getMembersByRelationship('Driya', 'Maternal aunts')
    ).toEqual([]);
  });

  it('should be able to find brothers-in-law if any exist on record', () => {
    expect(
      familyTree.getMembersByRelationship('Ambi', 'Brothers-in-law')
    ).toEqual([familyTree.findMember('Ish'), familyTree.findMember('Vich')]);
    expect(
      familyTree.getMembersByRelationship('Jnki', 'Brothers-in-law')
    ).toEqual([]);
  });

  it('should be able to find sisters-in-law if any exist on record', () => {
    expect(
      familyTree.getMembersByRelationship('Lika', 'Sisters-in-law')
    ).toEqual([familyTree.findMember('Satya')]);
    expect(
      familyTree.getMembersByRelationship('Jata', 'Sisters-in-law')
    ).toEqual([]);
  });

  it('should be able to find cousins if any exist on record', () => {
    expect(familyTree.getMembersByRelationship('Drita', 'Cousins')).toEqual([
      familyTree.findMember('Vila'),
      familyTree.findMember('Chika'),
      familyTree.findMember('Satvy'),
      familyTree.findMember('Savya'),
      familyTree.findMember('Saayan'),
    ]);
    expect(familyTree.getMembersByRelationship('Jata', 'Cousins')).toEqual([]);
  });
});
