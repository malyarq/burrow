import { ModpackDetailsHeader, type ModpackDetailsHeaderProps } from './ModpackDetailsHeader';
import {
  ModpackDetailsActionBar,
  type ModpackDetailsActionBarProps,
} from './ModpackDetailsActionBar';

export interface ModpackDetailsOverviewProps {
  actions: ModpackDetailsActionBarProps;
  header: ModpackDetailsHeaderProps;
}

export function ModpackDetailsOverview({ actions, header }: ModpackDetailsOverviewProps) {
  return (
    <div data-details-owner="overview" data-testid="modpack-details-overview" className="min-w-0 space-y-5">
      <section className="space-y-5" data-testid="modpack-details-hero">
        <ModpackDetailsHeader {...header} />
        <ModpackDetailsActionBar {...actions} />
      </section>
    </div>
  );
}
