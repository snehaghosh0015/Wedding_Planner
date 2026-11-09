import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBudgetMetrics, getUpcomingDues } from './budget';
import { calculateRsvpStats, filterGuests } from './rsvp';
import { matchHoneymoonDestinations } from './honeymoon';
import { Expense, Guest, HoneymoonDestination } from '../types/wedding';

test('calculateBudgetMetrics correctly calculates totals, remaining balance, and categories', () => {
  const sampleExpenses: Expense[] = [
    {
      id: 'e1',
      title: 'Tuscan Villa Venue Rental',
      category: 'Venue',
      vendorName: 'Villa La Selva',
      estimatedCost: 20000,
      actualCost: 21000,
      paidAmount: 15000,
      dueDate: '2027-08-01',
      isPaid: false,
    },
    {
      id: 'e2',
      title: 'Gourmet Tuscan Dinner & Bar',
      category: 'Catering',
      vendorName: 'Florentine Feast Co.',
      estimatedCost: 18000,
      actualCost: 18000,
      paidAmount: 18000,
      dueDate: '2027-07-15',
      isPaid: true,
    },
  ];

  const metrics = calculateBudgetMetrics(50000, sampleExpenses);

  assert.equal(metrics.totalBudget, 50000);
  assert.equal(metrics.totalActual, 39000);
  assert.equal(metrics.totalPaid, 33000);
  assert.equal(metrics.totalRemainingBalance, 11000);
  assert.equal(metrics.totalUpcomingDues, 6000); // 21000 - 15000
  assert.equal(metrics.categoryBreakdowns.Venue.actual, 21000);
  assert.equal(metrics.categoryBreakdowns.Catering.actual, 18000);
});

test('getUpcomingDues filters paid items and calculates overdue or upcoming status', () => {
  const referenceDate = new Date('2027-08-10T00:00:00Z');
  const expenses: Expense[] = [
    {
      id: 'e1',
      title: 'Overdue Florist Deposit',
      category: 'Flowers & Decor',
      vendorName: 'Bloom Studio',
      estimatedCost: 4000,
      actualCost: 4000,
      paidAmount: 1000,
      dueDate: '2027-08-01', // Before referenceDate -> Overdue
      isPaid: false,
    },
    {
      id: 'e2',
      title: 'Due Soon String Quartet',
      category: 'Entertainment',
      vendorName: 'Siena Strings',
      estimatedCost: 2500,
      actualCost: 2500,
      paidAmount: 500,
      dueDate: '2027-08-14', // Within 4 days -> Due Soon
      isPaid: false,
    },
    {
      id: 'e3',
      title: 'Already Paid Cake',
      category: 'Catering',
      vendorName: 'Dolce Pastry',
      estimatedCost: 1200,
      actualCost: 1200,
      paidAmount: 1200,
      dueDate: '2027-08-01',
      isPaid: true,
    },
  ];

  const dues = getUpcomingDues(expenses, referenceDate);
  assert.equal(dues.length, 2);
  assert.equal(dues[0].status, 'Overdue');
  assert.equal(dues[0].amountDue, 3000);
  assert.equal(dues[1].status, 'Due Soon');
  assert.equal(dues[1].amountDue, 2000);
});

test('calculateRsvpStats tallies confirmed, dietary needs, and plus-ones', () => {
  const guests: Guest[] = [
    {
      id: 'g1',
      name: 'Sofia Rossi',
      email: 'sofia@example.com',
      status: 'Confirmed',
      dietary: 'Vegetarian',
      hasPlusOne: true,
      plusOneName: 'Marco Rossi',
      plusOneDietary: 'Gluten-Free',
      attendingCeremony: true,
      attendingReception: true,
      updatedAt: '2027-06-01',
    },
    {
      id: 'g2',
      name: 'David Chen',
      email: 'david@example.com',
      status: 'Confirmed',
      dietary: 'None',
      hasPlusOne: false,
      attendingCeremony: true,
      attendingReception: true,
      updatedAt: '2027-06-02',
    },
    {
      id: 'g3',
      name: 'Emma Watson',
      email: 'emma@example.com',
      status: 'Pending',
      dietary: 'None',
      hasPlusOne: false,
      attendingCeremony: false,
      attendingReception: false,
      updatedAt: '2027-06-03',
    },
    {
      id: 'g4',
      name: 'Liam Smith',
      email: 'liam@example.com',
      status: 'Declined',
      dietary: 'None',
      hasPlusOne: false,
      attendingCeremony: false,
      attendingReception: false,
      updatedAt: '2027-06-04',
    },
  ];

  const stats = calculateRsvpStats(guests);
  assert.equal(stats.invited, 4);
  assert.equal(stats.confirmed, 2);
  assert.equal(stats.pending, 1);
  assert.equal(stats.declined, 1);
  assert.equal(stats.totalAttendees, 3); // 2 confirmed + 1 plus-one
  assert.equal(stats.confirmationRate, 50);
  assert.equal(stats.dietaryCounts.Vegetarian, 1);
  assert.equal(stats.dietaryCounts['Gluten-Free'], 1);

  const filtered = filterGuests(guests, 'Confirmed');
  assert.equal(filtered.length, 2);

  const searchFiltered = filterGuests(guests, 'All', 'Marco');
  assert.equal(searchFiltered.length, 1);
  assert.equal(searchFiltered[0].name, 'Sofia Rossi');
});

test('matchHoneymoonDestinations scores destinations based on budget and vibes', () => {
  const destinations: HoneymoonDestination[] = [
    {
      id: 'd1',
      name: 'Amalfi Coast & Capri',
      country: 'Italy',
      tagline: 'Cliffside romance, pastel villages and azure waters',
      vibes: ['Beach', 'Cultural', 'Gastronomy'],
      estimatedCostTotal: 12000,
      costBreakdown: { flights: 2000, luxuryStayPerNight: 800, nights: 10, activitiesAndDining: 2000 },
      bestSeason: 'May - October',
      romanticHighlights: ['Private sunset boat tour around Capri', 'Candlelit dining on cliff terrace'],
      imageUrl: '/src/assets/images/honeymoon_amalfi_vista.jpg',
      rating: 4.9,
    },
    {
      id: 'd2',
      name: 'Swiss Alps Luxury Chalet',
      country: 'Switzerland',
      tagline: 'Snowy peaks, private spa, and scenic train journeys',
      vibes: ['Mountains', 'Romantic Hideaway'],
      estimatedCostTotal: 15000,
      costBreakdown: { flights: 2500, luxuryStayPerNight: 1000, nights: 8, activitiesAndDining: 4500 },
      bestSeason: 'December - March & July - September',
      romanticHighlights: ['Private outdoor hot tub overlooking Matterhorn'],
      imageUrl: '/src/assets/images/venue_villa_estate.jpg',
      rating: 4.8,
    },
  ];

  // Couple with $14,000 budget and Beach + Cultural vibes
  const matches = matchHoneymoonDestinations(14000, ['Beach', 'Cultural'], destinations);
  assert.equal(matches.length, 2);
  assert.equal(matches[0].destination.id, 'd1');
  assert.equal(matches[0].budgetFit, 'Within Budget');
  assert.equal(matches[0].matchingVibes.length, 2);
  assert.ok(matches[0].suitabilityScore > matches[1].suitabilityScore);
});
