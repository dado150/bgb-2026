/* Best Global Brands 2026 — data from the report */
window.BGB = window.BGB || {};

// [rank, name, change % (null = new entrant), value $B, flag]  flag: R = top riser, N = new entrant
BGB.brands = [
  [1,'Apple',9,514.6],[2,'Microsoft',14,443.7],[3,'Google',23,389.3,'R'],[4,'Amazon',10,351.8],[5,'Samsung',16,105.2,'R'],
  [6,'NVIDIA',71,74.0,'R'],[7,'Instagram',14,65.5,'R'],[8,'Coca-Cola',0,60.3],[9,'Toyota',-20,59.5],[10,'YouTube',22,58.9,'R'],
  [11,'Cisco',17,57.0,'R'],[12,"McDonald's",5,55.5],[13,'Oracle',8,45.5],[14,'Facebook',10,45.3],[15,'Hermès',11,45.2],
  [16,'Louis Vuitton',-7,45.1],[17,'SAP',8,44.6],[18,'IBM',11,43.8],[19,'Adobe',2,41.7],[20,'Mercedes-Benz',-19,40.8],
  [21,'Disney',-2,40.4],[22,'BMW',-18,38.4],[23,'Netflix',22,34.1,'R'],[24,'Chanel',8,32.9],[25,'J.P. Morgan',7,31.1],
  [26,'Allianz',9,30.7],[27,'Booking.com',13,26.5],[28,'BlackRock',9,25.8],[29,'Hyundai',2,25.0],[30,'Visa',5,24.1],
  [31,'MasterCard',5,22.2],[32,'Nike',-35,21.7],[33,'Zara',11,21.6],[34,'Accenture',3,21.5],[35,'Sony',-5,21.2],
  [36,'Qualcomm',5,21.2],[37,'Salesforce',7,20.5],[38,'Uniqlo',16,20.5,'R'],[39,'Spotify',38,20.5,'R'],[40,'GE Aerospace',12,20.5],
  [41,'AXA',10,20.1],[42,'Pepsi',-1,20.1],[43,'Dell',22,19.9,'R'],[44,'Airbnb',9,19.6],[45,'Honda',-22,19.4],
  [46,'IKEA',-13,19.2],[47,'Siemens',8,19.1],[48,'LEGO',14,18.8],[49,'PayPal',-6,18.6],[50,'Tesla',-38,18.3],
  [51,'Ferrari',15,17.7,'R'],[52,'Uber',35,17.2,'R'],[53,'Goldman Sachs',10,16.9],[54,'Nintendo',8,16.7],[55,'UPS',-7,16.6],
  [56,'adidas',-8,16.1],[57,"L'Oréal Paris",4,15.3],[58,'Zurich',null,15.0,'N'],[59,'eBay',10,15.0],[60,'Citi',9,14.3],
  [61,'Monster',23,14.2,'R'],[62,'Schneider Electric',10,13.9],[63,'Pampers',0,13.8],[64,'Budweiser',8,13.0],[65,'Audi',-19,12.4],
  [66,'Porsche',-17,12.4],[67,'HSBC',8,12.4],[68,'Caterpillar',33,12.3,'R'],[69,'Cartier',9,12.2],[70,'Nescafé',-6,12.1],
  [71,'Volkswagen',-23,11.6],[72,'Santander',9,11.3],[73,'LinkedIn',6,11.0],[74,'HP',-10,10.8],[75,'Xiaomi',13,10.7],
  [76,'Corona',10,10.7],[77,'Colgate',3,10.7],[78,'Intel',-8,10.6],[79,'Gillette',3,10.5],[80,'H&M',-12,10.4],
  [81,'Nasdaq',11,10.2],[82,'Philips',-8,9.8],[83,'3M',9,9.8],[84,'Nestlé',0,9.7],[85,'Dior',-5,8.9],
  [86,'Shopify',28,8.9,'R'],[87,'Kia',3,8.8],[88,'John Deere',-2,8.6],[89,'BYD',5,8.5],[90,'Hitachi',null,8.1,'N'],
  [91,'Tiffany & Co.',6,8.1],[92,'Sephora',5,8.1],[93,'Gucci',-31,8.1],[94,'Huawei',2,7.7],[95,'GE HealthCare',null,7.7,'N'],
  [96,'Prada',-15,7.6],[97,'Danone',-8,7.5],[98,'FedEx',-6,7.3],[99,'Hewlett Packard Enterprise',null,7.3,'N'],[100,'Nissan',-23,7.2]
].map(([rank, name, change, value, flag]) => ({
  rank, name, change, value,
  riser: flag === 'R', entrant: flag === 'N'
}));

// Top Risers in the order the report lists them
BGB.topRisers = [6,39,52,68,86,61,3,43,10,23,11,5,38,51,7];
BGB.newEntrants = [58,90,95,99];

// Cumulative value of the ranking, billion USD
BGB.cumulative = [988,977,974,996,1045,1093,1156,1214,1158,1203,1258,1385,1501,1600,1715,1796,1872,2015,2131,2326,2667,3089,3265,3426,3575,3866]
  .map((v, i) => ({ year: 2001 + i, value: v }));

BGB.brandsToWatch = [
  { name: 'Aesop', text: 'Coherence across products, language and architecture demonstrates how an entire customer experience can sustain desirability.' },
  { name: 'Anthropic', text: 'Has placed philosophy at the heart of the AI debate — turning its principles around AI into a part of the proposition itself. 300,000+ business customers by September 2025.' },
  { name: "Arc'teryx", text: 'Extending technical credibility into broader cultural relevance, while protecting the performance delivery that earned customer trust.' },
  { name: 'Loewe', text: 'Has made craftsmanship a structural asset and a platform for cultural experimentation, connecting luxury with art and design.' },
  { name: 'Nubank', text: 'Reached 131 million customers across Brazil, Mexico and Colombia — challenging established expectations in finance.' },
  { name: 'ON', text: 'Extending technical credibility into broader cultural relevance, reaching new audiences without losing performance.' },
  { name: 'Oura', text: 'Made health insights accessible through discreet and intimate design — an ongoing relationship around sleep, recovery and wellbeing.' },
  { name: 'Revolut', text: 'Ended 2025 with 68.3 million retail customers and £1.7 billion in annual pre-tax profit — reshaping an industry of legacy players.' },
  { name: 'Rimowa', text: 'Has elevated luggage design into a recognizable expression of identity.' },
  { name: 'SKIMS', text: 'Translated an understanding of underserved needs into expansion across categories and partnerships with a clear, strong personality.' }
];
