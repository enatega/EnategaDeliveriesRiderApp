import apiClient from './apiClient';
import {
  LanguageOption,
  LanguageSettingsApiResponse,
  LanguageSettingsResponse,
  UpdateLanguagePayload,
  UpdateLanguageResponse,
} from './languageTypes';

const LANGUAGE_SETTINGS_PATH = '/apps/deliveries/settings/language';

const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    countryName: 'United States',
    countryCode: 'US',
    imageUrl: null,
    isRtl: false,
  },
  {
    code: 'fr',
    name: 'French',
    countryName: 'France',
    countryCode: 'FR',
    imageUrl: null,
    isRtl: false,
  },
];

const normalizeLanguageCode = (languageTag?: string | null) => {
  const code = languageTag?.split('-')?.[0]?.toLowerCase();
  return code === 'fr' ? 'fr' : 'en';
};

export const languageService = {
  getLanguageSettings: async (): Promise<LanguageSettingsResponse> => {
    const response = await apiClient.get<LanguageSettingsApiResponse>(LANGUAGE_SETTINGS_PATH);

    if ('languages' in response) {
      return response;
    }

    const selectedCode = normalizeLanguageCode(response.rider_language);
    const languages = LANGUAGE_OPTIONS.map((option) => ({
      ...option,
      isSelected: option.code === selectedCode,
    }));
    const selectedLanguage = languages.find((option) => option.code === selectedCode) ?? null;

    return {
      rider_id: response.rider_id,
      rider_language: selectedCode,
      selectedLanguage,
      languages,
    };
  },
  updateLanguage: (payload: UpdateLanguagePayload) =>
    apiClient.patch<UpdateLanguageResponse>(LANGUAGE_SETTINGS_PATH, payload),
};
