import { parse } from "rss-to-json";
export interface CategoryData {
  id: string;
  emoji?: string;
  name: string;
  description: string;
}

export interface ArticleData {
  id: string;
  title: string;
  description: string;
  published: number;
  created: number;
  category: string[];
  enclosures: {
    url: string;
    length?: string;
    type: string;
    expression?: string;
    width?: string;
    height?: string;
  }[];
  media: {
    thumbnail: {
      url: string;
      type: string;
      expression?: string;
      width?: string;
      height?: string;
    };
  };
}


export const baseUrl = "https://www.ensonhaber.com/rss";

/**
 * Returns an array of predefined news services with their details
 * @returns {CategoryData[]} An array of Service objects containing news categories
 * @example
 * const services = getServices();
 * // Returns array of services like:
 * // [
 * //   { 
 * //     id: "ensonhaber",
 * //     name: "En Son Haberler",
 * //     description: "Günün öne çıkan haber başlıkları..."
 * //   },
 * //   ...
 * // ]
 */
export function getCategories(): CategoryData[] {
  return [
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
    { id: "magazin", name: "Magazin", description: "Ünlüler, dedikodular, etkinlikler ve sosyal yaşamdan en son haberler burada!" },
  ];
}

/**
 * Fetches and parses the category data from an XML source.
 * 
 * @param {string} id - The category ID to fetch.
 * @returns {Promise<ArticleData[]>} A promise that resolves to an array of article data.
 */
export async function getCategory(id: string): Promise<ArticleData[]> {
  const response = (await parse(`${baseUrl}/${id}.xml`)).items as unknown as ArticleData[];
  return response;
}
