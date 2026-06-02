export type LanguageOption = {
  code: string;
  name: string;
  countryName: string;
  countryCode: string;
  imageUrl?: string | null;
  isRtl: boolean;
  isSelected?: boolean;
};

export type LanguageSettingsResponse = {
  rider_id: string;
  rider_language: string;
  selectedLanguage: LanguageOption | null;
  languages: LanguageOption[];
};

export type LanguageSettingsApiResponse =
  | LanguageSettingsResponse
  | {
      rider_id: string;
      rider_language: string;
    };

export type UpdateLanguagePayload = {
  riderLanguage: string;
};

export type UpdateLanguageResponse = LanguageSettingsResponse & {
  message: string;
};
