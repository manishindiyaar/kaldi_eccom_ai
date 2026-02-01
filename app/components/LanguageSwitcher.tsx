/**
 * LanguageSwitcher Component
 * Allows users to switch between English and Hindi
 */

'use client';

import { useLanguage } from '@/lib/languageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Languages size={20} className="text-cyan-400" />
      <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'hi')}>
        <SelectTrigger className="w-[140px] bg-gray-900/50 border-cyan-500/30 text-gray-300 hover:bg-cyan-500/10 hover:border-cyan-500/50">
          <SelectValue placeholder={t('language')} />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-cyan-500/30">
          <SelectItem value="en" className="text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400">English</SelectItem>
          <SelectItem value="hi" className="text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400">हिंदी (Hindi)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
