
import React from 'react';
import { TimeKeeper } from '@/components/TimeKeeper';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Voice of Time Keeper</h1>
      <TimeKeeper />
    </div>
  );
};

export default Index;
