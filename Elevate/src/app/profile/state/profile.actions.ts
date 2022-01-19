import {
  FreelancerAssignmentVM,
  FreelancerVM,
  IdentitydocumentsVM,
  QualificationsVM,
  ReferncesVM,
  RolesVM,
  SkillsVM,
  WorkHistoryVM
} from './../../model/freelancer.model';

import { Action } from '@ngrx/store';
import { DocumentVM } from '../../model/document.model';
import { TrainingVM } from '../../model/exam.model';

export enum ProfileActionTypes {
  LoadProfileDetail = '[Profile] Load Profile Detail',
  LoadProfileDetailSuccess = '[Profile] Profile Detail success',
  LoadProfileDetailFailed = '[Profile] Profile Detail failed',

  UpdateMasterData = '[Profile] Update master data',
  UpdateMasterDataSuccess = '[Profile] Update master data success',
  UpdateMasterDataFailed = '[Profile] Update master data failed',

  UpdateAppearanceData = '[Profile] Update Appearance data',
  UpdateAppearanceDataSuccess = '[Profile] Update Appearance data success',
  UpdateAppearanceDataFailed = '[Profile] Update Appearance data failed',

  UpdateQualificationData = '[Profile] Update Qualification data',
  UpdateQualificationDataSuccess = '[Profile] Update Qualification data success',
  UpdateQualificationDataFailed = '[Profile] Update Qualification data failed',

  UpdateEmploymentData = '[Profile] Update Employment data',
  UpdateEmploymentDataSuccess = '[Profile] Update Employment data success',
  UpdateEmploymentDataFailed = '[Profile] Update Employment data failed',

  UpdateLegalData = '[Profile] Update Legal data',
  UpdateLegalDataSuccess = '[Profile] Update Legal data success',
  UpdateLegalDataFailed = '[Profile] Update Legal data failed',

  UpdateFreelancerContractData = '[Profile] Update Freelancer Contract data',
  UpdateFreelancerContractDataSuccess = '[Profile] Update Freelancer Contract data success',
  UpdateFreelancerContractDataFailed = '[Profile] Update Freelancer Contract data failed',

  LoadFreelancerAssignment = '[profile] Load freelancer Assignment',
  LoadFreelancerAssignmentSuccess = '[profile] freelancer Assignment success',

  GoToNext = '[Profile] Go to next',
}
export class LoadProfileDetail implements Action {
  readonly type = ProfileActionTypes.LoadProfileDetail;
  constructor(public payload: { id: number; mode: string }) { }
}
export class LoadProfileDetailSuccess implements Action {
  readonly type = ProfileActionTypes.LoadProfileDetailSuccess;
  constructor(public payload: { profile: FreelancerVM; mode: string }) { }
}
export class LoadProfileDetailFailed implements Action {
  readonly type = ProfileActionTypes.LoadProfileDetailFailed;
  constructor(public payload: any) { }
}

export class UpdateMasterData implements Action {
  readonly type = ProfileActionTypes.UpdateMasterData;
  constructor(public payload: { profile: FreelancerVM; id: number; onboarding: boolean; isValid: boolean; state: string; documentIds: number[];
    collectionId: number | undefined; isAdmin: boolean
    }) { }
}
export class UpdateMasterDataSuccess implements Action {
  readonly type = ProfileActionTypes.UpdateMasterDataSuccess;
  constructor(public payload: { id: number }) { }
}
export class UpdateMasterDataFailed implements Action {
  readonly type = ProfileActionTypes.UpdateMasterDataFailed;
  constructor(public payload: any) { }
}

export class UpdateAppearanceData implements Action {
  readonly type = ProfileActionTypes.UpdateAppearanceData;
  constructor(
    public payload: {
      profile: FreelancerVM;
      id: number;
      newProfilePictureId?: number;
      newBodyPictureId?: number;
      picIds: number[],
      onboarding: boolean, isValid: boolean, state: string, isAdmin: boolean
    }
  ) { }
}
export class UpdateAppearanceDataSuccess implements Action {
  readonly type = ProfileActionTypes.UpdateAppearanceDataSuccess;
  constructor(public payload: { id: number }) { }
}
export class UpdateAppearanceDataFailed implements Action {
  readonly type = ProfileActionTypes.UpdateAppearanceDataFailed;
  constructor(public payload: any) { }
}

export class UpdateQualificationData implements Action {
  readonly type = ProfileActionTypes.UpdateQualificationData;
  constructor(
    public payload: {
      languages: string | null;
      id: number;
      resume: number;
      about_me: string;
      qualifications: QualificationsVM[];
      training: TrainingVM[];
      deletedQualifications: number[];
      deletedTrainings: number[];
      onboarding: boolean;
      isValid: boolean;
      state: string;
      isAdmin: boolean;
    }
  ) { }
}

export class UpdateEmploymentData implements Action {
  readonly type = ProfileActionTypes.UpdateEmploymentData;
  constructor(
    public payload: {
      id: number;
      refernces: ReferncesVM[];
      industry_exposure: [];
      workHistories: [];
      skills: [];
      primary_role: [];
      secondry_role: [];
      deletedReferences: number[];
      deleteWorkHistory: number[];
      work_preference:[];
      onboarding: boolean;
      isValid: boolean;
      state: string;
      isAdmin: boolean;
    }
  ) { }
}
export class UpdateQualificationDataSuccess implements Action {
  readonly type = ProfileActionTypes.UpdateQualificationDataSuccess;
  constructor(public payload: { id: number }) { }
}
export class UpdateQualificationDataFailed implements Action {
  readonly type = ProfileActionTypes.UpdateQualificationDataFailed;
  constructor(public payload: any) { }
}


export class UpdateEmploymentDataSuccess implements Action {
  readonly type = ProfileActionTypes.UpdateEmploymentDataSuccess;
  constructor(public payload: { id: number }) { }
}
export class UpdateEmploymentDataFailed implements Action {
  readonly type = ProfileActionTypes.UpdateFreelancerContractDataFailed;
  constructor(public payload: any) { }
}
export class UpdateLegalData implements Action {
  readonly type = ProfileActionTypes.UpdateLegalData;
  constructor(
    public payload: {
      id: number;
      documentIds: number[];
      profile: FreelancerVM;
      collectionId: number | undefined;
      originalCollectionId: number | undefined;
      identityDocuments: IdentitydocumentsVM[];
      deletedLegalDocuments: number[];
      deletedIdentityDocuments: number[];
      onboarding: boolean; isValid: boolean; state: string;
      isAdmin: boolean;
    }
  ) { }
}
export class UpdateLegalDataSuccess implements Action {
  readonly type = ProfileActionTypes.UpdateLegalDataSuccess;
  constructor(public payload: { id: number }) { }
}
export class UpdateLegalDataFailed implements Action {
  readonly type = ProfileActionTypes.UpdateLegalDataFailed;
  constructor(public payload: any) { }
}


export class UpdateFreelancerContractData implements Action {
  readonly type = ProfileActionTypes.UpdateFreelancerContractData;
  constructor(
    public payload: {
      id: number;
      documentIds: number[];
      profile: FreelancerVM;
      collectionId: number | undefined;
      hasChange: boolean;
      isUpdate: boolean;
      contract_type_identifier?: string;
      documents: any;
      gtcDocs: any;
      change: any;
      part: string;
      state: string;
      contractTypeEnabled: boolean;
      isValid: boolean;
      onboarding: boolean;
    }
  ) { }
}
export class UpdateFreelancerContractDataSuccess implements Action {
  readonly type = ProfileActionTypes.UpdateFreelancerContractDataSuccess;
  constructor(public payload: { id: number }) { }
}
export class UpdateFreelancerContractDataFailed implements Action {
  readonly type = ProfileActionTypes.UpdateFreelancerContractDataFailed;
  constructor(public payload: any) { }
}


export class GoToNext implements Action {
  readonly type = ProfileActionTypes.GoToNext;
  constructor(public payload: {
    id: number,
    part: string,
    isOnboarding: boolean,
    valid: boolean,
    contractTypeEnabled: boolean
  }) { }
}

export class LoadFreelancerAssignment implements Action {
  readonly type = ProfileActionTypes.LoadFreelancerAssignment;
  constructor(public payload: { id: number, mode: string}) {}
}
export class LoadFreelancerAssignmentSuccess implements Action {
  readonly type = ProfileActionTypes.LoadFreelancerAssignmentSuccess;
  constructor(public payload: { freelancerAssignment: FreelancerAssignmentVM, mode: string }) {}
}

export type ProfileActions =
  // load profile
  | LoadProfileDetail
  | LoadProfileDetailSuccess
  | LoadProfileDetailFailed
  // update master data
  | UpdateMasterData
  | UpdateMasterDataSuccess
  | UpdateMasterDataFailed
  // update appearance data
  | UpdateAppearanceData
  | UpdateAppearanceDataSuccess
  | UpdateAppearanceDataFailed
  // update Qualification data
  | UpdateQualificationData
  | UpdateQualificationDataSuccess
  | UpdateQualificationDataFailed
  // update Employment data
    | UpdateEmploymentData
    | UpdateEmploymentDataSuccess
    | UpdateEmploymentDataFailed
  // update Legal data
  | UpdateLegalData
  | UpdateLegalDataSuccess
  | UpdateLegalDataFailed
  // update Freelancer Contract data
  | UpdateFreelancerContractData
  | UpdateFreelancerContractDataSuccess
  | UpdateFreelancerContractDataFailed
  | LoadFreelancerAssignment
  | LoadFreelancerAssignmentSuccess;
