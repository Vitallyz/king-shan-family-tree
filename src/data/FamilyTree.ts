import Person from './Person';
import type { Gender, Relationship } from '../types/types';

class FamilyTree {
  private readonly members: Person[];

  constructor() {
    this.members = [];
  }

  addMember(member: Person): void {
    this.members.push(member);
  }

  findMember(name: string): Person | undefined {
    return this.members.find((member) => member.getName() === name);
  }

  getAllMembersNames(): string[] {
    return this.members.map((member) => member.getName());
  }

  getMembersByRelationship(name: string, relationship: Relationship): Person[] {
    const member = this.findMember(name);
    if (!member) return [];

    switch (relationship) {
      case 'Father': {
        return member.getFather();
      }
      case 'Mother': {
        return member.getMother();
      }
      case 'Children': {
        return member.getChildren();
      }
      case 'Sons': {
        return member.getSons();
      }
      case 'Daughters': {
        return member.getDaughters();
      }
      case 'Brothers': {
        const father = member.getFather()?.[0];
        if (father !== undefined)
          return father
            .getSons()
            .filter((child) => member.getName() !== child.getName());
        break;
      }
      case 'Sisters': {
        const father = member.getFather()?.[0];
        if (father !== undefined)
          return father
            .getDaughters()
            .filter((child) => member.getName() !== child.getName());
        break;
      }
      case 'Granddaughters': {
        const granddaughters: Person[] = [];
        member
          .getChildren()
          .forEach((child) =>
            child
              .getChildren()
              .forEach((grandChild) =>
                grandChild.getGender() === 'female'
                  ? granddaughters.push(grandChild)
                  : null
              )
          );
        return granddaughters;
      }
      case 'Grandsons': {
        const granddaughters: Person[] = [];
        member
          .getChildren()
          .forEach((child) =>
            child
              .getChildren()
              .forEach((grandChild) =>
                grandChild.getGender() === 'male'
                  ? granddaughters.push(grandChild)
                  : null
              )
          );
        return granddaughters;
      }
      case 'Paternal uncles': {
        const father = member.getFather()?.[0];
        if (father !== undefined) {
          const grandfather = father.getFather()?.[0];
          if (grandfather !== undefined) {
            return grandfather
              .getSons()
              .filter((uncle) => uncle.getName() !== father.getName());
          }
        }
        break;
      }
      case 'Maternal uncles': {
        const mother = member.getMother()?.[0];
        if (mother !== undefined) {
          const grandfather = mother.getFather()?.[0];
          if (grandfather !== undefined) {
            return grandfather
              .getSons()
              .filter((uncle) => uncle.getName() !== mother.getName());
          }
        }
        break;
      }
      case 'Paternal aunts': {
        const father = member.getFather()?.[0];
        if (father !== undefined) {
          const grandfather = father.getFather()?.[0];
          if (grandfather !== undefined) {
            return grandfather
              .getDaughters()
              .filter((aunt) => aunt.getName() !== father.getName());
          }
        }
        break;
      }
      case 'Maternal aunts': {
        const mother = member.getMother()?.[0];
        if (mother !== undefined) {
          const grandfather = mother.getFather()?.[0];
          if (grandfather !== undefined) {
            return grandfather
              .getDaughters()
              .filter((aunt) => aunt.getName() !== mother.getName());
          }
        }
        break;
      }
      case 'Brothers-in-law': {
        const brothersInLow = member
          .getSpose()
          ?.getFather()?.[0]
          .getSons()
          .filter((son) => son.getName() !== member.getSpose()?.getName());
        if (brothersInLow !== undefined) return brothersInLow;
        break;
      }
      case 'Sisters-in-law': {
        const brothersInLow = member
          .getSpose()
          ?.getFather()?.[0]
          .getDaughters()
          .filter(
            (dauther) => dauther.getName() !== member.getSpose()?.getName()
          );
        if (brothersInLow !== undefined) return brothersInLow;
        break;
      }
      case 'Cousins': {
        const cousins: Person[] = [];
        const father = member.getFather()?.[0];
        if (father !== undefined) {
          const grandfather = father.getFather()?.[0];
          if (grandfather !== undefined)
            grandfather
              .getChildren()
              .forEach(
                (uncle_or_aunt) =>
                  uncle_or_aunt.getName() !== member.getFather()[0].getName() &&
                  uncle_or_aunt
                    .getChildren()
                    .forEach((cousin) => cousins.push(cousin))
              );
        }
        const mother = member.getMother()?.[0];
        if (mother !== undefined) {
          const grandfather = mother.getFather()?.[0];
          if (grandfather !== undefined)
            grandfather
              .getChildren()
              .forEach(
                (uncle_or_aunt) =>
                  uncle_or_aunt.getName() !== member.getMother()[0].getName() &&
                  uncle_or_aunt
                    .getChildren()
                    .forEach((cousin) => cousins.push(cousin))
              );
        }
        return cousins;
      }
    }

    return [];
  }

  buildFromFamilyData(
    data: Array<{
      name: string;
      gender: Gender;
      spouse: string | null;
      children: string[];
      parents: Person[];
    }>
  ): void {
    const personMap = new Map<string, Person>();

    // Create Person instances and store them in the map
    data.forEach((personData) => {
      const person = new Person(personData.name, personData.gender);
      personMap.set(personData.name, person);
    });

    // Establish parent-child relationships
    data.forEach((personData) => {
      const person = personMap.get(personData.name);
      if (personData.spouse !== null) {
        const spose = personMap.get(personData.spouse) ?? null;
        person?.setSpose(spose);
      }
      if (personData.children?.length > 0) {
        personData.children.forEach((childName) => {
          const child = personMap.get(childName);
          if (child !== undefined && person !== undefined) {
            person.addChild(child);
            child.addParent(person);
          }
        });
      }
    });

    // Add all members to the family tree
    personMap.forEach((person) => {
      this.addMember(person);
    });
  }
}

export default FamilyTree;
