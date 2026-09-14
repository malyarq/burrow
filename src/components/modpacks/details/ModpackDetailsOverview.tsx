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
    <div data-details-owner="overview" data-testid="modpack-details-overview" className="min-w-0">
      <section
        className="surface-card space-y-5 overflow-hidden p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_15rem]"
        data-testid="modpack-details-hero"
      >
        <ModpackDetailsHeader {...header} />
        <ModpackDetailsActionBar {...actions} />
      </section>
    </div>
  );
}
