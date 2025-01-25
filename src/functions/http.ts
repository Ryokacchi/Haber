export interface CategoryData {
  id: string;
  name: string;
  description: string;
}

/**
 * Returns an array of predefined news services with their details
 * @returns {CategoryData[]} An array of Service objects containing news categories
 * @example
 * const services = getServices();
 * // Returns array of services like:
 * // [
 * //   { 
 * //     id: "ensonhaber",
 * //     name: "Resmî Kaynak",
 * //     description: "Haberlerin doğruluğu ve güvenilirliği için..."
 * //   },
 * //   ...
 * // ]
 */
export function getCategories(): CategoryData[] {
  return [
    { id: "ensonhaber", name: "Resmî Kaynak", description: "Haberlerin doğruluğu ve güvenilirliği için yalnızca onaylanmış ve resmî kaynaklardan alınan içerikler paylaşılır." },
    { id: "mansetler", name: "Manşetler", description: "Günün öne çıkan ve dikkat çeken haber başlıkları burada!" },
    { id: "gundem", name: "Gündem", description: "Kamuoyunun en çok konuştuğu ve ilgiyle takip ettiği konular burada!" },
    { id: "politika", name: "Politika", description: "Yerel ve küresel siyasetteki en önemli gelişmeler ve analizler burada!" },
    { id: "ekonomi", name: "Ekonomi", description: "Piyasalardaki son durum, finansal gelişmeler ve ekonomik analizler burada!" },
    { id: "dunya", name: "Global", description: "Dünyada yaşanan önemli olaylar ve uluslararası gelişmeler burada!" },
    { id: "saglik", name: "Sağlık", description: "Güncel sağlık haberleri, uzman görüşleri ve yaşamınıza dokunacak öneriler burada!" },
    { id: "otomobil", name: "Otomobil", description: "Son model araçlar, sektör haberleri ve otomobil dünyasındaki yenilikler burada!" },
    { id: "kultur-sanat", name: "Kültür Sanat", description: "Edebiyat, sinema, tiyatro ve sanat dünyasından en güncel haberler burada!" },
    { id: "teknoloji", name: "Teknoloji", description: "Yeni ürünler, dijital trendler ve teknolojideki son gelişmeler burada!" },
    { id: "medya", name: "Medya", description: "Yayın dünyasındaki en son haberler, popüler programlar ve medya sektörüyle ilgili gelişmeler burada!" },
    { id: "yasam", name: "Yaşam", description: "Günlük yaşamın içinden ilham verici hikayeler, pratik ipuçları ve sağlıklı yaşam önerileri burada!" },
    { id: "kralspor", name: "Spor", description: "Takımlar, maç sonuçları, transfer haberleri ve spor dünyasındaki önemli gelişmeler burada!" },
    { id: "3-sayfa", name: "3. Sayfa", description: "Şaşırtıcı, dikkat çeken ve bazen tartışma yaratan olaylar bu bölümde!" },
    { id: "magazin", name: "Magazin", description: "Ünlüler, dedikodular, etkinlikler ve sosyal yaşamdan en son haberler burada!" },
    { id: "kadin", name: "Kadın", description: "Kadın hakları, yaşam tarzı, sağlık, moda ve başarı hikayeleri bu bölümde!" },
  ];
}