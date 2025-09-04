import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Department, Game, Participant, Round, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCaption, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({game, participants} : {game: Game, participants: {data: Participant[]}}) {
    const [activeGame, setActiveGame] = useState<Game | null>(game);
    const [activeParticipants, setActiveParticipants] = useState<Participant[]>(participants?.data || []);
    const [title, setTitle] = useState<string>(game ? `${game.name} (${game.round.name})` : 'Not started');
    const [finishedRound, setFinishedRound] = useState<boolean>(false);
    const [leaderboards, setLeaderboards] = useState<Department[]>([]);

    const retrieveLeaderboards = () => {
        axios.get('/leaderboard')
            .then(response => {
                setLeaderboards(response.data.data);
            });
    }

    useEcho(
        'game',
        'GameScoreSaved',
        (event: { game: { id: number } }) => {
            axios.get(`/answers/${event.game.id}`)
                .then(response => {
                    setFinishedRound(false);
                    setActiveGame(response.data.game);
                    setActiveParticipants(response.data.participants);
                    setTitle(`${response.data.game.name} (${response.data.game.round.name})`);
                    retrieveLeaderboards();
                });
        }
    );

    useEcho(
        'game',
        'FinishedRound',
        (event: { round: Round }) => {
            activeGame && axios.get(`/answers/${activeGame?.id}`)
                .then(response => {
                    setTitle(`Round ${event.round.name} has finished.`);
                    setFinishedRound(true);
                    retrieveLeaderboards();
                    setActiveParticipants(
                        response.data.participants.sort(
                            (a: Participant, b: Participant) => b.result.score - a.result.score
                        )
                    );
                });
        }
    );

    // Only retrieve leaderboards once on mount
    useState(() => {
        retrieveLeaderboards();
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* <h1 className="text-2xl font-bold">Welcome to Wipro Independence Day Game!</h1> */}

                {! activeGame && <p className="text-red-600">The game has not started yet.</p>}

                { activeGame && <>
                    <Card className='mb-4'>
                        <CardContent className="flex flex-col items-start">
                            <span className="text-lg font-semibold">Current Game:</span>
                            <span className="text-2xl font-bold">{title}</span>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="game">
                        <TabsList>
                            <TabsTrigger value="game">Game</TabsTrigger>
                            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                        </TabsList>
                        <TabsContent value="game">
                            <div className="col-span-4 grid md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
                                {activeParticipants.map(participant => (
                                    <Card key={participant.id} className={cn(
                                        'flex flex-col justify-between gap-2 py-4',
                                        participant.pivot.is_correct || finishedRound ? 'bg-green-700 text-white' : (participant.pivot.is_incorrect ? 'bg-red-500 text-white' : '')
                                    )}>
                                        <div className="flex justify-between px-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-lg 2xl:text-3xl">{participant.name}</span>
                                                <span className="text-sm 2xl:text-xl">{participant.order}</span>
                                            </div>
                                            <div
                                                className="w-8 h-8 2xl:w-12 2xl:h-12 rounded border-2 border-white flex-shrink-0"
                                                style={{ backgroundColor: participant.department?.color || '#ccc' }}
                                            />
                                        </div>
                                        <CardContent className='font-bold text-3xl 2xl:text-4xl flex justify-center items-center'>
                                            {participant.result.score}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="leaderboard">
                            <div className="grid grid-cols-3 gap-4">
                                {leaderboards?.map(department => (
                                    <div key={department.id} className="mb-2">
                                        <Table className="min-w-full caption-top">
                                            <TableCaption className="font-semibold flex items-center gap-2">
                                                <div
                                                    className="w-6 h-6 rounded border-2 border-white flex-shrink-0"
                                                    style={{ backgroundColor: department?.color || '#ccc' }}
                                                />
                                                {department.name}
                                            </TableCaption>
                                            <TableBody>
                                                {department.participants
                                                    ?.slice()
                                                    .sort((a: Participant, b: Participant) => {
                                                        // Sort by deleted_at: null first, then by score descending
                                                        if (!!a.deleted_at !== !!b.deleted_at) {
                                                            return !!a.deleted_at ? 1 : -1;
                                                        }

                                                        return (b.result?.score ?? 0) - (a.result?.score ?? 0);
                                                    })
                                                    .map((participant: Participant) => (
                                                        <TableRow key={participant.id} className={participant.deleted_at ? 'bg-red-500 text-white' : ''}>
                                                            <TableCell className="px-4 py-2 border-b">{participant.name}</TableCell>
                                                            <TableCell className="px-4 py-2 border-b">{participant.result?.score ?? 0}</TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </>}
            </div>
        </AppLayout>
    );
}
