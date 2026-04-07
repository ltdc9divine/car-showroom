// Sketchfab Model Finder Utility
// Giúp tìm kiếm các mô hình 3D từ Sketchfab API

interface SketchfabModel {
  uid: string;
  name: string;
  thumbnailUrl: string;
  downloadUrl?: string;
  glbUrl?: string;
  author: string;
  license: string;
}

const SKETCHFAB_API_BASE = 'https://api.sketchfab.com/v3';

/**
 * Tìm kiếm model từ Sketchfab
 * @param carName - Tên xe cần tìm
 * @param limit - Số kết quả trả về
 */
export const searchSketchfabModels = async (
  carName: string,
  limit: number = 5
): Promise<SketchfabModel[]> => {
  try {
    const query = encodeURIComponent(carName);
    const url = `${SKETCHFAB_API_BASE}/search?q=${query}&type=models&downloadable=true&license=free&limit=${limit}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return data.results.map((model: any) => ({
      uid: model.uid,
      name: model.name,
      thumbnailUrl: model.thumbnailUrl,
      author: model.user.username,
      license: model.license?.label || 'Unknown',
      glbUrl: model.gltfUrl?.gltfBinary,
    }));
  } catch (error) {
    console.error('Error searching Sketchfab:', error);
    return [];
  }
};

/**
 * Lấy thông tin chi tiết model
 */
export const getSketchfabModelDetail = async (uid: string) => {
  try {
    const response = await fetch(`${SKETCHFAB_API_BASE}/models/${uid}`);
    const data = await response.json();
    
    return {
      uid: data.uid,
      name: data.name,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      author: data.user.username,
      license: data.license?.label,
      glbUrl: data.gltfUrl?.gltfBinary,
      objUrl: data.gltfUrl?.obj,
      filesize: data.filesize,
      geometry: {
        vertices: data.geometry.vertices,
        faces: data.geometry.faces,
      },
    };
  } catch (error) {
    console.error('Error fetching model detail:', error);
    return null;
  }
};

/**
 * Danh sách các model được khuyến nghị cho các loại xe
 * (collected từ Sketchfab search results)
 */
export const RECOMMENDED_MODELS = {
  'Lamborghini Aventador SVJ': {
    keywords: ['Lamborghini Aventador'],
    model: 'car-lamborghini-aventado',
    author: 'nguyenbeo190',
  },
  'Ferrari SF90 Stradale': {
    keywords: ['Ferrari SF90', 'Ferrari 2024'],
    model: 'ferrari-sf90',
  },
  'Bugatti Chiron Super Sport': {
    keywords: ['Bugatti Chiron Sport'],
    model: 'bugatti-chiron-sport-2019',
    author: 'SQUIR3D',
  },
  'Porsche 911 GT3 RS': {
    keywords: ['Porsche 911', 'Porsche GT3'],
    model: 'porsche-911-gt3',
  },
  'McLaren P1': {
    keywords: ['McLaren', 'McLaren P1'],
    model: 'mclaren-p1',
  },
  'Rolls-Royce Spectre': {
    keywords: ['Rolls-Royce', 'Rolls-Royce Spectre'],
    model: 'rolls-royce-spectre',
  },
  'Aston Martin Valkyrie': {
    keywords: ['Aston Martin', 'Aston Martin Valkyrie'],
    model: 'aston-martin-valkyrie',
  },
  'Mercedes-AMG One': {
    keywords: ['Mercedes-AMG', 'Mercedes One'],
    model: 'mercedes-amg-one',
  },
  'Lamborghini Huracan STO': {
    keywords: ['Lamborghini Huracan', 'Lamborghini Huracan STO'],
    model: 'lamborghini-huracan-sto',
  },
  'Ferrari 296 GTB': {
    keywords: ['Ferrari 296', 'Ferrari 296 GTB'],
    model: 'ferrari-296-gtb',
  },
  'Porsche Taycan Turbo S': {
    keywords: ['Porsche Taycan', 'Porsche Taycan Turbo'],
    model: 'porsche-taycan',
  },
  'McLaren 720S': {
    keywords: ['McLaren 720S', 'McLaren 720'],
    model: 'mclaren-720s',
  },
};

/**
 * Helper để build Sketchfab model URL
 */
export const buildSketchfabGlbUrl = (modelId: string): string => {
  return `https://media.sketchfab.com/models/${modelId}/model.glb`;
};

/**
 * Script để tìm kiếm tất cả model
 * Chạy trong browser console để tìm các model URL
 */
export const findAllModels = async () => {
  console.log('🔍 Searching for car models on Sketchfab...');
  
  const results: Record<string, string> = {};
  
  for (const [carName, config] of Object.entries(RECOMMENDED_MODELS)) {
    console.log(`Searching for: ${carName}`);
    
    const models = await searchSketchfabModels(config.keywords[0], 1);
    if (models.length > 0) {
      results[carName] = models[0].glbUrl || '';
      console.log(`✅ Found: ${models[0].name}`);
    } else {
      console.log(`❌ Not found: ${carName}`);
    }
    
    // Delay để tránh rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
};

/**
 * Generate TypeScript code cho car-models.ts
 */
export const generateCarModelsConfig = (models: Record<string, string>): string => {
  let code = 'export const CAR_3D_MODELS: Record<string, string> = {\n';
  
  for (const [carName, url] of Object.entries(models)) {
    if (url) {
      code += `  '${carName}': '${url}',\n`;
    }
  }
  
  code += '};\n';
  return code;
};
