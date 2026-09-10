import {
  formatCampaigns,
  filterCampaigns,
  isPatternMatchingWithURL,
} from '../campaignHelper';
import campaigns from './campaignFixtures';

global.chatwootWebChannel = {
  workingHoursEnabled: false,
};
describe('#Campaigns Helper', () => {
  describe('#isPatternMatchingWithURL', () => {
    it('returns correct value if a valid URL is passed', () => {
      expect(
        isPatternMatchingWithURL(
          'https://zeshan.local*',
          'https://zeshan.local'
        )
      ).toBe(true);

      expect(
        isPatternMatchingWithURL(
          'https://*.zeshan.local/pricing/',
          'https://zeshan.local'
        )
      ).toBe(true);

      expect(
        isPatternMatchingWithURL(
          'https://{*.}?zeshan.local/pricing?test=true',
          'https://zeshan.local'
        )
      ).toBe(true);

      expect(
        isPatternMatchingWithURL(
          'https://{*.}?zeshan.local/pricing*\\?*',
          'https://zeshan.local'
        )
      ).toBe(true);
    });
  });

  describe('formatCampaigns', () => {
    it('should return formatted campaigns if campaigns are passed', () => {
      expect(formatCampaigns({ campaigns })).toStrictEqual([
        {
          id: 1,
          timeOnPage: 3,
          triggerOnlyDuringBusinessHours: false,
          url: 'https://zeshan.local',
        },
        {
          id: 2,
          triggerOnlyDuringBusinessHours: false,
          timeOnPage: 6,
          url: 'https://zeshan.local',
        },
      ]);
    });
  });
  describe('filterCampaigns', () => {
    it('should return filtered campaigns if formatted campaigns are passed', () => {
      expect(
        filterCampaigns({
          campaigns: [
            {
              id: 1,
              timeOnPage: 3,
              url: 'https://zeshan.local',
              triggerOnlyDuringBusinessHours: false,
            },
            {
              id: 2,
              timeOnPage: 6,
              url: 'https://zeshan.local',
              triggerOnlyDuringBusinessHours: false,
            },
          ],
          currentURL: 'https://zeshan.local',
        })
      ).toStrictEqual([
        {
          id: 2,
          timeOnPage: 6,
          url: 'https://zeshan.local',
          triggerOnlyDuringBusinessHours: false,
        },
      ]);
    });
    it('should return filtered campaigns if formatted campaigns are passed and business hours enabled', () => {
      expect(
        filterCampaigns({
          campaigns: [
            {
              id: 1,
              timeOnPage: 3,
              url: 'https://zeshan.local',
              triggerOnlyDuringBusinessHours: false,
            },
            {
              id: 2,
              timeOnPage: 6,
              url: 'https://zeshan.local',
              triggerOnlyDuringBusinessHours: true,
            },
          ],
          currentURL: 'https://zeshan.local',
          isInBusinessHours: true,
        })
      ).toStrictEqual([
        {
          id: 2,
          timeOnPage: 6,
          url: 'https://zeshan.local',
          triggerOnlyDuringBusinessHours: true,
        },
      ]);
    });
    it('should return empty campaigns if formatted campaigns are passed and business hours disabled', () => {
      expect(
        filterCampaigns({
          campaigns: [
            {
              id: 1,
              timeOnPage: 3,
              url: 'https://zeshan.local',
              triggerOnlyDuringBusinessHours: true,
            },
            {
              id: 2,
              timeOnPage: 6,
              url: 'https://zeshan.local',
              triggerOnlyDuringBusinessHours: true,
            },
          ],
          currentURL: 'https://zeshan.local',
          isInBusinessHours: false,
        })
      ).toStrictEqual([]);
    });
  });
});
