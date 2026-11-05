import type { Metadata } from 'next';import './globals.css';
export const metadata:Metadata={title:'Viraj Mhatre | PL/SQL, ODI & ETL Developer',description:'Portfolio of Viraj Mhatre — Oracle PL/SQL, ODI and ETL developer specializing in data integration, performance and quality.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
