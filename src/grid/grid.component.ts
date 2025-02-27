import {Component, inject, OnInit, Renderer2, signal} from '@angular/core';
import {NgClass} from "@angular/common";

const FIELD_SIZE = 6;
type TypeCoord = 'vertical' | 'horizontal'
const rightVerticalCoords = [[2, 0], [2, 1], [1, 2], [2, 4], [3, 3], [3, 4], [3, 1], [3, 2], [5, 3], [4, 4], [4, 5], [4, 1]];
const rightHorizontalCoords = [[1, 2], [1, 3], [2, 3], [0, 4], [1, 4], [2, 5], [3, 1], [4, 2], [5, 2], [3, 3], [4, 3], [4, 4]];

const classHorizontalLattice = 'horizontal-lattice';
const classVerticalLattice = 'vertical-lattice';
const rightText = "Правильно!";
const wrongText = "Неверно. Попробуйте еще раз";

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent implements OnInit {

  lionCoords = [[1, 1], [2, 1], [3, 1], [0, 4]];
  crownCoords = [[2, 2], [3, 2], [2, 3], [3, 3]];
  fieldSize = FIELD_SIZE;
  //все координаты
  verticalCoords: number[][] = [];
  horizontalCoords: number[][] = [];

  verticalBorders: number[] = [];
  horizontalBorders: number[] = [];
  renderer = inject(Renderer2);
  readonly isShowed = signal(false);
  readonly resultText = signal('');


  ngOnInit(): void {
    for (let i = 0; i < this.fieldSize + 1; i++) {
      this.horizontalBorders.push(i);
      this.verticalBorders.push(i);

    }

  }

  //проверка на границы - они некликабельны
  isOutherBorder(item: number): boolean {
    return (item === 0 || item === this.fieldSize);
  }


  hasLionClass(x: number, y: number) {
    return (!!this.lionCoords?.some(coord => coord[0] === x && coord[1] === y));
  }

  hasCrownClass(x: number, y: number) {
    return (!!this.crownCoords?.some(coord => coord[0] === x && coord[1] === y));
  }

  toggleClass(e: any) {
    e.target.classList.toggle('active');
  }

  includesCoords(coords: number[][], currentCoord: number[]) {
    return coords.some(coord => coord[1] === currentCoord[1] && coord[0] === currentCoord[0]);
  }

  changeBorders(e: any, currentItem: number[]) {
    if (e.target.classList.contains(classVerticalLattice) && !this.isOutherBorder(currentItem[0])) {
      this.toggleClass(e);
      if (!this.includesCoords(this.verticalCoords, currentItem)) {
        this.verticalCoords.push(currentItem);
      } else {
        this.verticalCoords = this.verticalCoords.filter(coord => !(coord[0] === currentItem[0] && coord[1] === currentItem[1]));
      }
    } else if (e.target.classList.contains(classHorizontalLattice) && !this.isOutherBorder(currentItem[1])) {
      this.toggleClass(e);
      if (!this.includesCoords(this.horizontalCoords, currentItem)) {
        this.horizontalCoords.push(currentItem);
      } else {
        this.horizontalCoords = this.horizontalCoords.filter(coord => !(coord[0] === currentItem[0] && coord[1] === currentItem[1]));
      }
    }
  }


  check() {
    this.resultText.set(this.areAllCoordsRight() ? rightText : wrongText);
  }

  // в гугле сказано об одном варианте решения, поэтому просто ставим проверку на наличие точек
  areAllCoordsRight() {
    const hasWrongVertical = this.verticalCoords.some(coord =>
      !this.includesCoords(rightVerticalCoords, coord));
    const hasWrongHorizontal = this.horizontalCoords.some(coord => !this.includesCoords(rightHorizontalCoords, coord)
    );

    const hasAllVertical = rightVerticalCoords.every(rigthCoord =>
      this.includesCoords(this.verticalCoords, rigthCoord)
    );
    const hasAllHorizontal = rightHorizontalCoords.every(rigthCoord =>
      this.includesCoords(this.horizontalCoords, rigthCoord)
    );

    return (hasAllHorizontal && hasAllVertical && !hasWrongHorizontal && !hasWrongVertical);
  }

  // удяляем у всех горизонтальных и вертикальных линий класс active;
  clearField() {
    this.isShowed.set(false);
    [classVerticalLattice, classHorizontalLattice].forEach(classElement => {
      const elementsWithClass = document.querySelectorAll(`.${classElement}`);
      elementsWithClass.forEach(element => this.renderer.removeClass(element, 'active'));
    });
    this.resultText.set('');
    this.verticalCoords = [];
    this.horizontalCoords = [];
  }

  isRightCoordinate(typeCoord: TypeCoord, coord: number[]) {
    if (!this.isShowed()) {
      return false
    }

    if (typeCoord === 'horizontal' && rightHorizontalCoords.some(item => item[0] === coord[0] && item[1] === coord[1])) {
      return true;
    }
    return typeCoord === 'vertical' && rightVerticalCoords.some(item => item[0] === coord[0] && item[1] === coord[1]);

  }

  showAnswer() {
    this.isShowed.update(value => !value)
  }


  protected readonly classHorizontalLattice = classHorizontalLattice;
  protected readonly classVerticalLattice = classVerticalLattice;
}
