// 3D Model URLs từ GitHub repo AutoVision-3d-ModelViewer
// Direct GLB model links từ public repository

export const CAR_3D_MODELS: Record<string, string> = {
  'Lamborghini Aventador SVJ': 'https://raw.githubusercontent.com/Adarsh-Saripaka/AutoVision-3d-ModelViewer/main/lamborghini/2020_lamborghini_aventador_svj_63_roadster.glb',
  
  'Ferrari SF90 Stradale': 'https://raw.githubusercontent.com/Adarsh-Saripaka/AutoVision-3d-ModelViewer/main/ferrari/2020_ferrari_f8_tributo.glb',
  
  'Bugatti Chiron Super Sport': 'https://raw.githubusercontent.com/Adarsh-Saripaka/AutoVision-3d-ModelViewer/main/mclaren/2017_mclaren_720s.glb',
  
  'Porsche 911 GT3 RS': 'https://raw.githubusercontent.com/Adarsh-Saripaka/AutoVision-3d-ModelViewer/main/porsche/porsche_taycan_turbo_s_project_cars_3.glb',
  
  'McLaren P1': 'https://raw.githubusercontent.com/Adarsh-Saripaka/AutoVision-3d-ModelViewer/main/mclaren/2017_mclaren_720s.glb',
  
  'Rolls-Royce Spectre': 'https://raw.githubusercontent.com/Adarsh-Saripaka/AutoVision-3d-ModelViewer/main/tesla/cybertruck_modified.glb',
  
  'Aston Martin Valkyrie': 'https://raw.githubusercontent.com/Adarsh-Saripaka/AutoVision-3d-ModelViewer/main/aston-martin/aston_martin_vantage_roadster__www.vecarz.com.glb',
  
  'Mercedes-AMG One': 'https://raw.githubusercontent.com/Adarsh-Saripaka/AutoVision-3d-ModelViewer/main/mercedes/mercedes_amg_gt.glb',
  
  'Lamborghini Huracan STO': 'https://raw.githubusercontent.com/Adarsh-Saripaka/AutoVision-3d-ModelViewer/main/lamborghini/2019_lamborghini_huracan_gt_lbsilhouette.glb',
  
  'Ferrari 296 GTB': 'https://raw.githubusercontent.com/Adarsh-Saripaka/AutoVision-3d-ModelViewer/main/ferrari/2016_ferrari_488_gtb.glb',
  
  'Porsche Taycan Turbo S': 'https://raw.githubusercontent.com/Adarsh-Saripaka/AutoVision-3d-ModelViewer/main/porsche/2021_porsche_panamera_turbo_s_sport_turismo.glb',
  
  'McLaren 720S': 'https://raw.githubusercontent.com/Adarsh-Saripaka/AutoVision-3d-ModelViewer/main/mclaren/2017_mclaren_720s.glb',
};

export const useCarModel = (carName: string): string | null => {
  return CAR_3D_MODELS[carName] || null;
};
