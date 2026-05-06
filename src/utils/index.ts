import { Contact } from "@/types";

export const contactToBatchFormat = (contact: Contact) => {
  const batchContact: any = {
    phoneNumber: contact.phoneNumber,
  };

  if (contact.idNo) batchContact.idNo = contact.idNo;
  if (contact.gender) batchContact.gender = contact.gender;
  if (contact.name) batchContact.name = contact.name;
  if (contact.maxAge) batchContact.maxAge = contact.maxAge;

  return batchContact;
};
