import { TrendingUp } from "lucide-react";

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`p-4 rounded-2xl shadow-lg ${className}`}>{children}</div>;
};

const Button = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <button className={`px-4 py-2 rounded-lg shadow-md ${className}`}>{children}</button>
  );
};

const AnalyticsCard = () => {
  return (
    <aside className="w-72 p-4 space-y-6">
      {/* Analytics Section */}
      <Card className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg">
        <h2 className="text-xl font-light">See analytics of <br /> the Customer <br /> Clearly</h2>
        <Button className="mt-4 text-white px-4 py-2 rounded-lg shadow-md bg-indigo-400 backdrop:blur-xl hover:bg-indigo-600">
          See Analytics
        </Button>
      </Card>
      
      {/* Top Menu Section */}
      <Card className="p-4 rounded-2xl shadow-lg">
        <h2 className="text-lg font-semibold">Top Menu <span className="text-orange-500">This Week</span></h2>
        <p className="text-sm text-gray-500">10 - 12 Agustus 2023</p>
        <ul className="mt-3 space-y-2">
          <li className="bg-gray-100 p-2 rounded-lg flex justify-between items-center font-semibold">
            Nasi Goreng Jamur Special Resto Pak Min
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">1</span>
          </li>
          <li className="text-gray-600">2. Tongseng Sapi Gurih</li>
          <li className="text-gray-600">3. Nasi Gudeg Telur Ceker</li>
          <li className="text-gray-600">4. Nasi Ayam Serundeng</li>
          <li className="text-gray-600">5. Nasi Goreng Seafood</li>
        </ul>
        <div className="mt-4">
          <TrendingUp className="text-orange-500 w-full h-10" />
        </div>
      </Card>
    </aside>
  );
};

export default AnalyticsCard;
