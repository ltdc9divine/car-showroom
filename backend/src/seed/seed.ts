import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

// Import schemas
import { User, UserSchema } from '../modules/users/schemas/user.schema';
import { Brand, BrandSchema } from '../modules/brands/schemas/brand.schema';
import { Car, CarSchema } from '../modules/cars/schemas/car.schema';

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/showroom_db',
    );

    console.log('Connected to MongoDB');

    // Get models
    const UserModel = mongoose.model(User.name, UserSchema);
    const BrandModel = mongoose.model(Brand.name, BrandSchema);
    const CarModel = mongoose.model(Car.name, CarSchema);

    // Clear existing data
    await UserModel.deleteMany({});
    await BrandModel.deleteMany({});
    await CarModel.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const adminUser = await UserModel.create({
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Quản Trị Viên',
      role: 'admin',
      phone: '0123456789',
      address: 'Hà Nội',
    });

    const regularUser = await UserModel.create({
      email: 'user@example.com',
      password: 'user123',
      name: 'Nguyễn Văn A',
      role: 'user',
      phone: '0987654321',
      address: 'TP. Hồ Chí Minh',
    });

    console.log('Created users');

    // Create supercar brands
    const lamborghini = await BrandModel.create({
      name: 'Lamborghini',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Lamborghini_Logo.svg/1200px-Lamborghini_Logo.svg.png',
      description: 'Siêu xe Ý với thiết kế táo bạo và hiệu suất vượt trội',
    });

    const ferrari = await BrandModel.create({
      name: 'Ferrari',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ferrari_logo.svg/1200px-Ferrari_logo.svg.png',
      description: 'Siêu xe huyền thoại từ Ý, biểu tượng của sự xa hoa và hiệu suất',
    });

    const bugatti = await BrandModel.create({
      name: 'Bugatti',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Bugatti_logo.svg/1200px-Bugatti_logo.svg.png',
      description: 'Siêu xe Pháp đỉnh cao, công nghệ và tốc độ vô đối',
    });

    const porsche = await BrandModel.create({
      name: 'Porsche',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Porsche_logo.svg/1200px-Porsche_logo.svg.png',
      description: 'Siêu xe Đức nổi tiếng với hiệu suất và công nghệ tiên tiến',
    });

    const mclaren = await BrandModel.create({
      name: 'McLaren',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/McLaren_logo.svg/1200px-McLaren_logo.svg.png',
      description: 'Siêu xe Anh, kỹ thuật F1 áp dụng trên đường phố',
    });

    const rollsRoyce = await BrandModel.create({
      name: 'Rolls-Royce',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Rolls-Royce_Motor_Cars_logo.svg/1200px-Rolls-Royce_Motor_Cars_logo.svg.png',
      description: 'Xe hạng sang tối cao từ Anh với nước ngoài quý tộc',
    });

    const astonMartin = await BrandModel.create({
      name: 'Aston Martin',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Aston_Martin_logo_%282020%29.svg/1200px-Aston_Martin_logo_%282020%29.svg.png',
      description: 'Siêu xe Anh quyến rũ với thiết kế đẹp mắt',
    });

    const mercedesAmg = await BrandModel.create({
      name: 'Mercedes-AMG',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Mercedes_AMG_Petronas_F1_Team_2020.svg/1200px-Mercedes_AMG_Petronas_F1_Team_2020.svg.png',
      description: 'Siêu xe Đức hiệu suất cao từ hãng bê tông Mercedes-Benz',
    });

    console.log('Created brands');

    // Create supercars with public folder images
    const cars = [
      {
        name: 'Lamborghini Aventador SVJ',
        brand: lamborghini._id,
        price: 35000000000,
        year: 2024,
        mileage: 0,
        fuel: 'Petrol',
        color: '#FFD700',
        images: [
          '/lamborghiniaventadorsvj.jpeg',
          '/frontview.jpeg',
          '/sideprofile.jpeg',
          '/rearview.jpeg',
        ],
        interiorImages: [
          '/cockpit.jpeg',
          '/steeringwheel.jpeg',
          '/centerconsole.jpeg',
          '/chair.jpeg',
        ],
        angleImages: [
          '/topview.jpeg',
          '/speedview.jpeg',
          '/frontheadlight.jpeg',
          '/closeupview.jpeg',
        ],
        description: 'Siêu xe huyền thoại với động cơ V12 6.5L mạnh 770 mã lực, tốc độ tối đa 350 km/h',
        isAvailable: true,
      },
      {
        name: 'Ferrari SF90 Stradale',
        brand: ferrari._id,
        price: 42000000000,
        year: 2024,
        mileage: 0,
        fuel: 'Hybrid',
        color: '#E61E28',
        images: [
          '/ferrarisf90stradale.jpeg',
          '/frontview.jpeg',
          '/sideprofile.jpeg',
          '/rearview.jpeg',
        ],
        interiorImages: [
          '/cockpit.jpeg',
          '/steeringwheel.jpeg',
          '/centerconsole.jpeg',
          '/doorinteriorpanel.jpeg',
        ],
        angleImages: [
          '/topview.jpeg',
          '/speedview.jpeg',
          '/frontheadlight.jpeg',
          '/closeupview.jpeg',
        ],
        description: 'Siêu xe hybrid đầu tiên của Ferrari với công suất 1000 mã lực',
        isAvailable: true,
      },
      {
        name: 'Bugatti Chiron Super Sport',
        brand: bugatti._id,
        price: 85000000000,
        year: 2024,
        mileage: 0,
        fuel: 'Petrol',
        color: '#1a1a2e',
        images: [
          '/bugattichironsupersport.jpeg',
          '/frontview.jpeg',
          '/sideprofile.jpeg',
          '/rearview.jpeg',
        ],
        interiorImages: [
          '/cockpit.jpeg',
          '/steeringwheel.jpeg',
          '/centerconsole.jpeg',
          '/passengerseatviewinside.jpeg',
        ],
        angleImages: [
          '/topview.jpeg',
          '/speedview.jpeg',
          '/frontheadlight.jpeg',
          '/closeupview.jpeg',
        ],
        description: 'Siêu xe nhanh nhất thế giới với tốc độ 440 km/h, động cơ W16 8.0L',
        isAvailable: true,
      },
      {
        name: 'Porsche 911 GT3 RS',
        brand: porsche._id,
        price: 18000000000,
        year: 2024,
        mileage: 0,
        fuel: 'Petrol',
        color: '#004687',
        images: [
          '/porsche911gt3rs.jpeg',
          '/frontview.jpeg',
          '/sideprofile.jpeg',
          '/rearview.jpeg',
        ],
        interiorImages: [
          '/cockpit.jpeg',
          '/steeringwheel.jpeg',
          '/centerconsole.jpeg',
          '/chair.jpeg',
        ],
        angleImages: [
          '/topview.jpeg',
          '/speedview.jpeg',
          '/frontheadlight.jpeg',
          '/closeupview.jpeg',
        ],
        description: 'Siêu xe đường phố từ Porsche với động cơ 4.0L 518 mã lực',
        isAvailable: true,
      },
      {
        name: 'McLaren P1',
        brand: mclaren._id,
        price: 45000000000,
        year: 2024,
        mileage: 0,
        fuel: 'Hybrid',
        color: '#FF9800',
        images: [
          '/mclarenp1.jpeg',
          '/frontview.jpeg',
          '/sideprofile.jpeg',
          '/rearview.jpeg',
        ],
        interiorImages: [
          '/cockpit.jpeg',
          '/steeringwheel.jpeg',
          '/centerconsole.jpeg',
          '/doorinteriorpanel.jpeg',
        ],
        angleImages: [
          '/topview.jpeg',
          '/speedview.jpeg',
          '/frontheadlight.jpeg',
          '/closeupview.jpeg',
        ],
        description: 'Siêu xe hybrid với công suất 903 mã lực, một trong những siêu xe nhanh nhất',
        isAvailable: true,
      },
      {
        name: 'Rolls-Royce Spectre',
        brand: rollsRoyce._id,
        price: 32000000000,
        year: 2024,
        mileage: 0,
        fuel: 'Electric',
        color: '#C0C0C0',
        images: [
          '/rollsroycespectre.jpeg',
          '/frontview.jpeg',
          '/sideprofile.jpeg',
          '/rearview.jpeg',
        ],
        interiorImages: [
          '/cockpit.jpeg',
          '/steeringwheel.jpeg',
          '/centerconsole.jpeg',
          '/passengerseatviewinside.jpeg',
        ],
        angleImages: [
          '/topview.jpeg',
          '/speedview.jpeg',
          '/frontheadlight.jpeg',
          '/closeupview.jpeg',
        ],
        description: 'Siêu coupe điện đầu tiên của Rolls-Royce với sự xa hoa hoàng gia',
        isAvailable: true,
      },
      {
        name: 'Aston Martin Valkyrie',
        brand: astonMartin._id,
        price: 95000000000,
        year: 2024,
        mileage: 0,
        fuel: 'Hybrid',
        color: '#00A651',
        images: [
          '/astonmartinvalkyrie.jpeg',
          '/frontview.jpeg',
          '/sideprofile.jpeg',
          '/rearview.jpeg',
        ],
        interiorImages: [
          '/cockpit.jpeg',
          '/steeringwheel.jpeg',
          '/centerconsole.jpeg',
          '/chair.jpeg',
        ],
        angleImages: [
          '/topview.jpeg',
          '/speedview.jpeg',
          '/frontheadlight.jpeg',
          '/closeupview.jpeg',
        ],
        description: 'Siêu xe hybrid với thiết kế từ F1, công suất 1130 mã lực',
        isAvailable: true,
      },
      {
        name: 'Mercedes-AMG One',
        brand: mercedesAmg._id,
        price: 78000000000,
        year: 2024,
        mileage: 0,
        fuel: 'Hybrid',
        color: '#00BFFF',
        images: [
          '/mercedesamgone.jpeg',
          '/frontview.jpeg',
          '/sideprofile.jpeg',
          '/rearview.jpeg',
        ],
        interiorImages: [
          '/cockpit.jpeg',
          '/steeringwheel.jpeg',
          '/centerconsole.jpeg',
          '/doorinteriorpanel.jpeg',
        ],
        angleImages: [
          '/topview.jpeg',
          '/speedview.jpeg',
          '/frontheadlight.jpeg',
          '/closeupview.jpeg',
        ],
        description: 'Siêu xe hybrid với công nghệ F1, công suất 1000+ mã lực',
        isAvailable: true,
      },
      {
        name: 'Lamborghini Huracan STO',
        brand: lamborghini._id,
        price: 24000000000,
        year: 2024,
        mileage: 0,
        fuel: 'Petrol',
        color: '#FF1493',
        images: [
          '/lamborghinihuracansto.jpeg',
          '/frontview.jpeg',
          '/sideprofile.jpeg',
          '/rearview.jpeg',
        ],
        interiorImages: [
          '/cockpit.jpeg',
          '/steeringwheel.jpeg',
          '/centerconsole.jpeg',
          '/passengerseatviewinside.jpeg',
        ],
        angleImages: [
          '/topview.jpeg',
          '/speedview.jpeg',
          '/frontheadlight.jpeg',
          '/closeupview.jpeg',
        ],
        description: 'Siêu xe thể thao với động cơ V10 5.2L mạnh 640 mã lực',
        isAvailable: true,
      },
      {
        name: 'Ferrari 296 GTB',
        brand: ferrari._id,
        price: 28000000000,
        year: 2024,
        mileage: 0,
        fuel: 'Hybrid',
        color: '#DC143C',
        images: [
          '/ferrari296gtb.jpeg',
          '/frontview.jpeg',
          '/sideprofile.jpeg',
          '/rearview.jpeg',
        ],
        interiorImages: [
          '/cockpit.jpeg',
          '/steeringwheel.jpeg',
          '/centerconsole.jpeg',
          '/chair.jpeg',
        ],
        angleImages: [
          '/topview.jpeg',
          '/speedview.jpeg',
          '/frontheadlight.jpeg',
          '/closeupview.jpeg',
        ],
        description: 'Siêu xe hybrid V6 với 830 mã lực, kế thừa tinh hoa từ F1',
        isAvailable: true,
      },
      {
        name: 'Porsche Taycan Turbo S',
        brand: porsche._id,
        price: 19500000000,
        year: 2024,
        mileage: 0,
        fuel: 'Electric',
        color: '#FFB81C',
        images: [
          '/porschetaycanturbos.jpeg',
          '/frontview.jpeg',
          '/sideprofile.jpeg',
          '/rearview.jpeg',
        ],
        interiorImages: [
          '/cockpit.jpeg',
          '/steeringwheel.jpeg',
          '/centerconsole.jpeg',
          '/doorinteriorpanel.jpeg',
        ],
        angleImages: [
          '/topview.jpeg',
          '/speedview.jpeg',
          '/frontheadlight.jpeg',
          '/closeupview.jpeg',
        ],
        description: 'Siêu xe điện với công suất 761 mã lực, sạc nhanh công nghệ cao',
        isAvailable: true,
      },
      {
        name: 'McLaren 720S',
        brand: mclaren._id,
        price: 22000000000,
        year: 2024,
        mileage: 0,
        fuel: 'Petrol',
        color: '#FF8C00',
        images: [
          '/mclaren720s.jpeg',
          '/frontview.jpeg',
          '/sideprofile.jpeg',
          '/rearview.jpeg',
        ],
        interiorImages: [
          '/cockpit.jpeg',
          '/steeringwheel.jpeg',
          '/centerconsole.jpeg',
          '/passengerseatviewinside.jpeg',
        ],
        angleImages: [
          '/topview.jpeg',
          '/speedview.jpeg',
          '/frontheadlight.jpeg',
          '/closeupview.jpeg',
        ],
        description: 'Siêu xe với thiết kế đột phá và động cơ V8 4.0L 720 mã lực',
        isAvailable: true,
      },
    ];

    await CarModel.insertMany(cars);
    console.log('Created cars');

    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
