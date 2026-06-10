import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from './src/navigation/rootNavigation';
import { PaperProvider } from 'react-native-paper';
import z from 'zod';
import { es } from 'zod/v4/locales';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24
    }
  }
})
z.config(es())

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <PaperProvider>
          <RootStack />
        </PaperProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;