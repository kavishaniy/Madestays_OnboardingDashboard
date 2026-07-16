// Types mirror onboarding-data.json exactly. `status` is typed as `string`
// rather than a closed union because the dataset contains at least one value
// ("on_hold") that isn't in statusLegend — the UI has to survive that, not
// pretend it can't happen.

export type StepStatus = string;

export interface StepDefinition {
  id: string;
  label: string;
  order: number;
}

export interface PropertyStep {
  id: string;
  status: StepStatus;
  note?: string;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  bedrooms: number;
  image: string;
  targetGoLiveDate: string;
  steps: PropertyStep[];
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  accountManager: string;
}

export interface OnboardingData {
  owner: Owner;
  onboardingStepDefinitions: StepDefinition[];
  statusLegend: Record<string, string>;
  properties: Property[];
}
