import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // 簡単な認証（本格運用時は適切な認証を実装）
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_TOKEN || 'admin123'}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const csvPath = join(process.cwd(), 'subscriptions.csv');
    
    try {
      const csvContent = readFileSync(csvPath, 'utf-8');
      const lines = csvContent.trim().split('\n');
      
      const subscriptions = lines.map(line => {
        const [email, url, timestamp, utm_source] = line.split(',');
        return { email, url, timestamp, utm_source };
      });

      // 統計情報を計算
      const total = subscriptions.length;
      const withUrl = subscriptions.filter(s => s.url).length;
      const utmSources = subscriptions.reduce((acc, s) => {
        acc[s.utm_source] = (acc[s.utm_source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return NextResponse.json({
        subscriptions,
        stats: {
          total,
          withUrl,
          utmSources
        }
      });
    } catch (error) {
      return NextResponse.json({ 
        subscriptions: [], 
        stats: { total: 0, withUrl: 0, utmSources: {} }
      });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
