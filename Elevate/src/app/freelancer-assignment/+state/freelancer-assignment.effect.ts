import { Injectable } from '@angular/core';
import { FreelancerAction } from './freelancer-assignment.action';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FreelancerAssignmentServices } from '../../services/freelancer-assignment.services';
import { map, mergeMap } from 'rxjs/operators';
import { freelancerAssignmentResponse } from '../../model/freelancer-assignment.model';

@Injectable()

export class FreelancerAssignmentEffect {
  constructor(private actions$: Actions,  private freelancerAssignmentServices: FreelancerAssignmentServices) {}
  loadFreelancerAssignment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FreelancerAction.loadFreelancerAssignment),
      mergeMap(( { attend }) => this.freelancerAssignmentServices.freelancerAssignmentList( attend  )),
      map(( list: freelancerAssignmentResponse | freelancerAssignmentResponse[] ) =>
        FreelancerAction.loadFreelancerAssignmentSuccess({ list }))
    )
  );
  FreelancerAssignmentDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FreelancerAction.freelancerAssignmentDetail),
      mergeMap(({ paramId, updateFreelancerAssignmentValue }) => this.freelancerAssignmentServices.freelancerAssignmentDetails( paramId, updateFreelancerAssignmentValue )),
      map((list: any) => FreelancerAction. freelancerAssignmentDetailSuccess({ list }))
    )
  );
}
