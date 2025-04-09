export class Documet{
    document_type_id:string;
  constructor(item:Partial<Documet>={}){
  this.document_type_id=item.document_type_id||'';
  }
}
export class Compitition{
  name:string;
  dob:string;
  status:string;
  constructor(item:Partial<Compitition>={}){
  this.name=item.name||'';
  this.dob=item.dob||'';
  this.status=item.status||'';
  }
}