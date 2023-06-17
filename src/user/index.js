'use strict';
const userUtils = require(`../startup/helper`);

async function addNewContact(email,phoneNumber,linkedId){
  let addContact = `INSERT INTO contact (email,phoneNumber) VALUES("${email}","${phoneNumber}")`;
  if(linkedId) addContact = `INSERT INTO contact (email,phoneNumber,linkedId,linkPrecedence) VALUES("${email}","${phoneNumber}",${linkedId},"secondary")`;
  const resp = await userUtils.sqlExecutorAsync(null, null, addContact, null);
}

async function getContact(email,phoneNumber,linkedId){
  let statement = `SELECT * FROM contact  WHERE email = "${email}" OR phoneNumber = "${phoneNumber}" ORDER BY created_at ;`;
  if(linkedId) statement = `SELECT * FROM contact  WHERE email = "${email}" OR phoneNumber = "${phoneNumber}" OR linkedId = ${linkedId} or id = ${linkedId} ORDER BY created_at ;`;
  const resp = await userUtils.sqlExecutorAsync(null, null, statement, null);
  const { data = []} = resp;
  return {data};
}

async function primaryToSecondary(id1,id2){
  const statement = `UPDATE contact SET  linkPrecedence = "secondary", linkedId = ${id1} WHERE id = ${id2};`;
  const resp = await userUtils.sqlExecutorAsync(null, null, statement, null);
  const { data = []} = resp;
}


async function saveContact(req,res){
  let { email = null, phoneNumber = null } = req.body;
  const { data } = await getContact(email,phoneNumber);
  //newUser
  if(!data.length && email && phoneNumber) await addNewContact(email,phoneNumber);
  
  //secondary contact
  if(data.length == 1 && email && phoneNumber && (data[0]?.email!=email||data[0]?.phoneNumber!=phoneNumber)){
    await addNewContact(email,phoneNumber, data[0]?.id);
  }
  
  // primary to secondary
  if(data.length == 2) await primaryToSecondary(data[0]?.id,data[1]?.id);
  const { data: data1 } = await getContact(email,phoneNumber);
  const { data: data2 } = await getContact( email,phoneNumber, data1[0]?.linkPrecedence == 'primary' ? data1[0]?.id : data1[0]?.linkedId);
  const ids = [];
  const emails = new Set();
  const phoneNumbers = new Set();

 data2.forEach((d)=>{
  ids.push(d.id);
  emails.add(d.email);
  phoneNumbers.add(d.phoneNumber);
 })
  return { contact: {primaryContatctId: ids[0], emails:[...emails], phoneNumbers:[...phoneNumbers], secondaryContactIds: ids.slice(1)}}
}

module.exports = {
  saveContact
}