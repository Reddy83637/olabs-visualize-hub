
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Your Dashboard</h1>
        <p className="text-xl text-gray-600 mb-8">Access your analytics and insights</p>
        <Link to="/admin">
          <Button 
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Go to Admin Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Index;
