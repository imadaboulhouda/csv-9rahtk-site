const cheerio = require('cheerio');
const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var cron = require('node-cron');

async function getInfoEcole(link,el)
{
  try{
const url = "https://www.9rayti.com"+link;
            let data = await axios(url,{
                headers:{
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
                }
            });
          
            data = await data.data;
            const  $ = cheerio.load(data);

            const ville = $(".school-info").find(".col-md-6:nth-child(1)").find('a').text();
            const numero = $(".school-info").find(".col-md-6:nth-child(2)").text();
            
            if(el == "ville") return ville;
            if(el == "numero") return numero
            return "";
            
    }catch(e){
        console.warn("error",e);
    }
}
async function getEcole()
{
    try{
const url = "https://www.9rayti.com/ecole";
            let data = await axios(url,{
                headers:{
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
                }
            });
            const dataWeb = []
            data = await data.data;
            const  $ = cheerio.load(data);

            $(".archive .col-sm-4").each(async function(_,el){
                var ecole = ($(el).text());
                var lien = ($(el).find("a").attr('href'));
               
                 dataWeb.push({
                    ecole,
                    lien,
                  
                    
                })
              
                
            });


              for(var i=0;i<dataWeb.length;i++)
              {
                
             var lien = dataWeb[i].lien;
             
                    var ville = await getInfoEcole(lien,"ville");
                var numero = await getInfoEcole(lien,"numero");
                  dataWeb[i].ville = ville;
                  dataWeb[i].numero = numero;
                
                console.log(i,dataWeb[i],dataWeb.length)
              }
const csvWriter = createCsvWriter({
        path: 'ecoles-9rayti.csv',
        header: ['ecole','ville','numero']
    });
    csvWriter.writeRecords(dataWeb)       // returns a promise
    .then(() => {
        console.log('...Done');
    });
               /* var ecole = ($(el).text());
                var lien = ($(el).find("a").attr('href'));
                var ville = await getInfoEcole(el.lien,"ville");
                var numero = await getInfoEcole(el.lien,"numero");
                 dataWeb.push({
                    ecole,
                    lien,
                    ville,
                    numero,
                    
                }) */
              
                
            

  
           
          

            
    }catch(e){
        console.warn("error",e);
    }
}

getEcole();