import type { Gender } from '../types/types';

class Person {
  private readonly name: string;
  private readonly gender: Gender;
  private spouse: Person | null;
  private readonly parents: Person[];
  private readonly children: Person[];

  constructor(name: string, gender: Gender) {
    this.name = name;
    this.gender = gender;
    this.parents = [];
    this.children = [];
    this.spouse = null;
  }

  getName(): string {
    return this.name;
  }

  getGender(): string {
    return this.gender;
  }

  getSpose(): Person | null {
    return this.spouse;
  }

  getParents(): Person[] {
    return this.parents;
  }

  getFather(): Person[] {
    return this.parents.filter((parent) => parent.getGender() === 'male');
  }

  getMother(): Person[] {
    return this.parents.filter((parent) => parent.getGender() === 'female');
  }

  getChildren(): Person[] {
    return this.children;
  }

  getDaughters(): Person[] {
    return this.getChildren().filter((child) => child.getGender() === 'female');
  }

  getSons(): Person[] {
    return this.getChildren().filter((child) => child.getGender() === 'male');
  }

  setSpose(spouse: Person | null): void {
    this.spouse = spouse;
  }

  addParent(parent: Person): void {
    this.parents.push(parent);
  }

  addChild(child: Person): void {
    this.children.push(child);
  }
}

export default Person;
