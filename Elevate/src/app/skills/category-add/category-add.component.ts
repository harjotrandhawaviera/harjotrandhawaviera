import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SkillService } from '../../services/skill.service';
@Component({
  selector: 'dialog-category-add',
  templateUrl: 'category-add.component.html',
})
export class CategoryAddDialogComponent {
  category: string = '';
  constructor(
    public dialogRef: MatDialogRef<CategoryAddDialogComponent>,
    private skillService: SkillService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  // onAdd() {
  //   this.skillService.addCategory(this.category).subscribe(() => {
  //     this.dialogRef.close();
  //   });
  // }
}
