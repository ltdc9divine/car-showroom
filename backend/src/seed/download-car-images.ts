import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

// Import schemas
import { Car, CarSchema } from '../modules/cars/schemas/car.schema';

// Local images from frontend/public (33 high-quality car images)
const LOCAL_IMAGES = [
  '/public/astonmartinvalkyrie.jpeg',
  '/public/bugattichironsupersport.jpeg', 
  '/public/ferrari296gtb.jpeg',
  '/public/ferrarisf90stradale.jpeg',
  '/public/lamborghiniaventadorsvj.jpeg',
  '/public/lamborghinihuracansto.jpeg',
  '/public/mclaren720s.jpeg',
  '/public/mclarenp1.jpeg',
  '/public/mercedesamgone.jpeg',
  '/public/porsche911gt3rs.jpeg',
  '/public/porschetaycanturbos.jpeg',
  '/public/rollsroycespectre.jpeg',
  '/public/bg.jpeg', '/public/heroshot.jpeg', '/public/speedview.jpeg',
  '/public/luxurygarage.jpeg', '/public/luxurydowntown.jpeg',
  '/public/frontview.jpeg', '/public/rearview.jpeg', '/public/sideprofile.jpeg',
  '/public/topview.jpeg', '/public/closeupview.jpeg',
  '/public/interiorindaylight.jpeg', '/public/interioratnight.jpeg',
  '/public/steeringwheel.jpeg', '/public/cockpit.jpeg', '/public/centerconsole.jpeg',
  '/public/carbonfiber.jpeg', '/public/frontheadlight.jpeg', '/public/POV.jpeg'
];

// Interior-focused images
const INTERIOR_IMAGES = [
  '/public/interiorindaylight.jpeg',
  '/public/interioratnight.jpeg',
  '/public/steeringwheel.jpeg',
  '/public/centerconsole.jpeg',
  '/public/cockpit.jpeg',
  '/public/chair.jpeg',
  '/public/doorinteriorpanel.jpeg',
  '/public/passengerseatviewinside.jpeg'
];

async function assignLocalImages() {
  let connection;
  try {
    connection = mongoose.connection;
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/showroom_db');
    
    console.log('✅ Connected to MongoDB - Assigning local public images\n');

    const CarModel = mongoose.model('Car', CarSchema);
    const cars = await CarModel.find();
    console.log(`📍 Found ${cars.length} cars`);

    if (cars.length === 0) {
      console.log('\n⚠️ No cars - run seed first!');
      if (connection) await connection.close();
      return;
    }

    for (let i = 0; i < cars.length; i++) {
      const car = cars[i];
      console.log(`\n🚗 ${car.name}`);

      // Assign 4 unique exterior, 3 interior, 3 angles using local images
      const exterior = LOCAL_IMAGES.slice(0, 12).sort(() => Math.random() - 0.5).slice(0, 4);
      const interior = INTERIOR_IMAGES.sort(() => Math.random() - 0.5).slice(0, 3);
      const angles = LOCAL_IMAGES.slice(12).sort(() => Math.random() - 0.5).slice(0, 3);

      car.images = Array.from(new Set([...(car.images || []), ...exterior]));
      car.interiorImages = Array.from(new Set([...(car.interiorImages || []), ...interior]));
      car.angleImages = Array.from(new Set([...(car.angleImages || []), ...angles]));

      await car.save();
      console.log(`  ✅ Exterior: ${car.images!.length} | Interior: ${car.interiorImages!.length} | Angles: ${car.angleImages!.length}`);
    }

    console.log('\n✨ All cars assigned LOCAL public folder images!');
    if (connection) await connection.close();

  } catch (error) {
    console.error('❌ Error:', error);
    if (connection) await connection.close();
  }
}

assignLocalImages();

