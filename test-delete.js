const http = require('http');
function makeRequest(method,path,body=null,token=null){
  return new Promise((resolve,reject)=>{
    const options={hostname:'localhost',port:5000,path,method,headers:{'Content-Type':'application/json'}};
    if(token) options.headers.Authorization=`Bearer ${token}`;
    const req=http.request(options,res=>{
      let data='';
      res.on('data',chunk=>data+=chunk);
      res.on('end',()=>{
        console.log(method,path,'->',res.statusCode,data);
        try{resolve(JSON.parse(data));}catch(e){resolve(null);}      
      });
    });
    req.on('error',reject);
    if(body) req.write(JSON.stringify(body));
    req.end();
  });
}
(async()=>{
  const signin=await makeRequest('POST','/api/auth/signin',{email:'ojfurniture2026@gmail.com',password:'Admin123!'});
  const token=signin?.token;
  console.log('token',token && token.slice(0,10));
  await makeRequest('DELETE','/api/product/2',null,token);
})();