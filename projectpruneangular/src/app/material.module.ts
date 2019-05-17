import {NgModule} from "@angular/core";

import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSidenavModule,
  MatGridListModule,
  MatDividerModule,
  MatListModule,
  MatToolbarModule,
  MatTableModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSortModule,
  MatSelectionList,
  MatButtonToggleModule
} from '@angular/material';

@NgModule({

  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSidenavModule,
    MatGridListModule,
    MatDividerModule,
    MatListModule,
    MatToolbarModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSortModule,
  ]
})

export class MaterialModule {}
