
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a mock login - should be replaced with actual authentication
    if (credentials.username && credentials.password) {
      toast({
        title: "Login Successful",
        description: "Welcome to OLabs Analytics Dashboard",
      });
      navigate("/admin");
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter valid credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2670&q=80')] bg-cover bg-center"
        />
        {/* Animated overlay patterns */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=2670&q=80')] bg-repeat bg-[length:50px_50px]"
        />
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut"
        }}
        className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl"
      />

      <div className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-16"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-left space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-block"
              >
                <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium">
                  Admin Portal
                </span>
              </motion.div>
              
              <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                OLabs Analytics Dashboard
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Advanced analytics and insights for administrators to monitor virtual lab performance and student progress.
              </p>

              <div className="space-y-4">
                {[
                  { text: "Comprehensive Analytics Dashboard", color: "green" },
                  { text: "Student Performance Tracking", color: "blue" },
                  { text: "Virtual Lab Usage Metrics", color: "purple" },
                  { text: "Real-time Data Visualization", color: "indigo" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className={`w-2 h-2 bg-${feature.color}-500 rounded-full`}
                    />
                    <span className="text-gray-700">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="w-full max-w-md mx-auto backdrop-blur-xl bg-white/80 border-0 shadow-2xl">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Administrator Login
                  </CardTitle>
                  <p className="text-sm text-gray-600 text-center">
                    Access the analytics dashboard
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Input
                          id="username"
                          type="text"
                          placeholder="Enter your username"
                          value={credentials.username}
                          onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                          className="bg-white/50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </motion.div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={credentials.password}
                          onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                          className="bg-white/50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </motion.div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-medium py-2.5"
                      >
                        Login to Dashboard
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
