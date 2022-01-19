import { FreelancerMappingService } from '.';
import { Injectable } from '@angular/core';
import { OfferResponse } from '../../model/offer.response';
import { OfferVM } from '../../model/offer.model';

@Injectable()
export class OfferMappingService {
  constructor(private freelancerMappingService: FreelancerMappingService) {}

  offerResponseToVM(response: OfferResponse): OfferVM {
    const offer: OfferVM = {};
    offer.id = response.id;
    offer.tender_id = response.tender_id;
    offer.freelancer_id = response.freelancer_id;
    offer.expired_at = response.expired_at;
    offer.deleted_at = response.deleted_at;
    if (response.freelancer && response.freelancer.data) {
      offer.freelancer = this.freelancerMappingService.freelancerResponseToVM(
        response.freelancer.data
      );
    }
    return offer;
  }
}
