export class Documet{
    document_type_id:string;
  constructor(item:Partial<Documet>={}){
  this.document_type_id=item.document_type_id||'';
  }
}
export class officials{
  name:string;
  dob:string;
  nationality:string;
  batStyle:string;
  bowlSpec:string;
  status:string;
  constructor(item:Partial<officials>={}){
  this.name=item.name||'';
  this.dob=item.dob||'';
  this.nationality=item.nationality||'';
  this.batStyle=item.batStyle||'';
  this.bowlSpec=item.bowlSpec||'';
  this.status=item.status||'';
  }
}