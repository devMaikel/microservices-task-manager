import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, CheckCircle2, MessageSquare, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8 bg-gray-50">
      <div className="text-center max-w-4xl mb-16">
        <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 sm:text-7xl mb-4">
          TaskFlow
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A plataforma de gestão de tarefas colaborativa construída com
          Microserviços NestJS e RabbitMQ. Organize projetos e atribua
          responsabilidades em tempo real.
        </p>

        <Link to="/sign-in">
          <Button
            size="lg"
            className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            Começar Agora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-10 border-b-2 border-primary pb-1">
        Recursos Chave
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
        <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <CardHeader>
            <CheckCircle2 className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Gestão Completa de Tarefas</CardTitle>
            <CardDescription>
              Crie, atualize e defina prioridades e status em tempo real.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>Prazo e Prioridade Personalizáveis.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Atribuição e Colaboração</CardTitle>
            <CardDescription>
              Atribua tarefas a múltiplos usuários e garanta que todos estejam
              na mesma página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>Múltiplos Usuários Atribuídos por Tarefa.</li>
              <li>Notificações em Tempo Real.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <CardHeader>
            <MessageSquare className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Comentários e Real-Time</CardTitle>
            <CardDescription>
              Comunique-se diretamente na tarefa e receba atualizações na hora.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>Comentários paginados.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
