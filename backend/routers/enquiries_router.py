from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Enquiry
from backend.schemas import EnquiryCreate, EnquiryResponse
from backend.services.whatsapp_service import WhatsAppService

router = APIRouter(prefix="/api/enquiries", tags=["Enquiries"])


@router.post("", response_model=EnquiryResponse, status_code=status.HTTP_201_CREATED)
def submit_enquiry(payload: EnquiryCreate, db: Session = Depends(get_db)):
    """Submits a customer contact / booking enquiry and generates WhatsApp redirection."""
    new_enquiry = Enquiry(
        name=payload.name.strip(),
        phone=payload.phone.strip() if payload.phone else None,
        email=payload.email.strip() if payload.email else None,
        subject=payload.subject.strip(),
        message=payload.message.strip(),
        status="NEW",
    )

    db.add(new_enquiry)
    db.commit()
    db.refresh(new_enquiry)

    wa_msg = WhatsAppService.generate_enquiry_message(new_enquiry)
    wa_link = WhatsAppService.generate_enquiry_whatsapp_link(new_enquiry)

    new_enquiry.whatsapp_message = wa_msg
    new_enquiry.whatsapp_link = wa_link
    db.commit()
    db.refresh(new_enquiry)

    return new_enquiry
