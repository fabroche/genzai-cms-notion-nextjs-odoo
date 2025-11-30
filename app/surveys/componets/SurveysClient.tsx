'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select } from '@/app/components/ui/select';
import { OdooSurveyN8N, surveyType } from '@/app/types/encuestas.types';
import { OdooSurveyN8NQuestion } from '@/app/types/encuestasQuestions.types';
import { Plus, Eye, Trash2, RefreshCw, Edit } from 'lucide-react';

interface SurveysClientProps {
  initialSurveys: OdooSurveyN8N[];
}

export default function SurveysClient({ initialSurveys }: SurveysClientProps) {
  const [surveys, setSurveys] = useState<OdooSurveyN8N[]>(initialSurveys);
  const [selectedSurvey, setSelectedSurvey] = useState<OdooSurveyN8N | null>(null);
  const [surveyQuestions, setSurveyQuestions] = useState<OdooSurveyN8NQuestion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState<'create' | 'edit'>('create');

  const [formData, setFormData] = useState({
    title: '',
    display_name: '',
    description: '',
    survey_type: 'survey' as surveyType,
  });

  const handleCreateNew = () => {
    setEditMode('create');
    setFormData({
      title: '',
      display_name: '',
      description: '',
      survey_type: 'survey',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (survey: OdooSurveyN8N) => {
    setEditMode('edit');
    setSelectedSurvey(survey);
    setFormData({
      title: survey.title,
      display_name: survey.display_name,
      description: survey.description,
      survey_type: survey.survey_type,
    });
    setIsDialogOpen(true);
  };

  const handleViewDetails = async (survey: OdooSurveyN8N) => {
    setSelectedSurvey(survey);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/surveys/${survey.id}/questions`);
      if (response.ok) {
        const questions = await response.json();
        setSurveyQuestions(questions);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      setSurveyQuestions([]);
    } finally {
      setIsLoading(false);
      setIsDetailsOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editMode === 'create' ? '/api/surveys' : `/api/surveys/${selectedSurvey?.id}`;
      const method = editMode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();

        if (editMode === 'create') {
          setSurveys([...surveys, result]);
        } else {
          setSurveys(surveys.map(s => s.id === selectedSurvey?.id ? result : s));
        }

        setIsDialogOpen(false);
        setFormData({
          title: '',
          display_name: '',
          description: '',
          survey_type: 'survey',
        });
      }
    } catch (error) {
      console.error('Error saving survey:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (surveyId: number) => {
    if (!confirm('¿Estás seguro de eliminar esta encuesta?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/surveys/${surveyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSurveys(surveys.filter(s => s.id !== surveyId));
      }
    } catch (error) {
      console.error('Error deleting survey:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/surveys/sync', {
        method: 'POST',
      });

      if (response.ok) {
        const syncedSurveys = await response.json();
        setSurveys(syncedSurveys);
      }
    } catch (error) {
      console.error('Error syncing surveys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSurveyTypeBadge = (type: surveyType) => {
    const variants: Record<surveyType, 'default' | 'secondary' | 'outline' | 'success'> = {
      survey: 'default',
      live_session: 'success',
      assessment: 'secondary',
      custom: 'outline',
    };
    return <Badge variant={variants[type]}>{type}</Badge>;
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Encuestas</h1>
          <p className="text-gray-500">Administra tus encuestas de Notion y Odoo</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSync} variant="outline" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Sincronizar
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Encuesta
          </Button>
        </div>
      </div>

      {/* Surveys Table */}
      <Card>
        <CardHeader>
          <CardTitle>Encuestas</CardTitle>
          <CardDescription>
            Total de encuestas: {surveys.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Activa</TableHead>
                <TableHead>Duración Promedio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell className="font-medium">{survey.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{survey.title}</div>
                      <div className="text-sm text-gray-500">{survey.display_name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getSurveyTypeBadge(survey.survey_type)}</TableCell>
                  <TableCell>
                    {survey.active ? (
                      <Badge variant="success">Activa</Badge>
                    ) : (
                      <Badge variant="secondary">Inactiva</Badge>
                    )}
                  </TableCell>
                  <TableCell>{survey.answer_duration_avg} min</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(survey)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(survey)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(survey.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editMode === 'create' ? 'Crear Nueva Encuesta' : 'Editar Encuesta'}
              </DialogTitle>
              <DialogDescription>
                {editMode === 'create'
                  ? 'Completa los datos para crear una nueva encuesta'
                  : 'Modifica los datos de la encuesta'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="display_name">Nombre para Mostrar</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="survey_type">Tipo de Encuesta</Label>
                <Select
                  id="survey_type"
                  value={formData.survey_type}
                  onChange={(e) => setFormData({ ...formData, survey_type: e.target.value as surveyType })}
                >
                  <option value="survey">Survey</option>
                  <option value="live_session">Live Session</option>
                  <option value="assessment">Assessment</option>
                  <option value="custom">Custom</option>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : editMode === 'create' ? 'Crear' : 'Actualizar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedSurvey?.title}</DialogTitle>
            <DialogDescription>{selectedSurvey?.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nombre para Mostrar</h3>
                <p>{selectedSurvey?.display_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
                <p>{selectedSurvey?.survey_type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Duración Promedio</h3>
                <p>{selectedSurvey?.answer_duration_avg} minutos</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Límite de Tiempo</h3>
                <p>
                  {selectedSurvey?.is_time_limited
                    ? `${selectedSurvey?.time_limit} minutos`
                    : 'Sin límite'}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Preguntas ({surveyQuestions.length})</h3>
              {isLoading ? (
                <p className="text-gray-500">Cargando preguntas...</p>
              ) : surveyQuestions.length > 0 ? (
                <div className="space-y-2">
                  {surveyQuestions.map((question, index) => (
                    <Card key={question.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">
                              {index + 1}. {question.title}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">{question.description}</p>
                            {question.question_placeholder && (
                              <p className="text-xs text-gray-400 mt-1 italic">
                                Placeholder: {question.question_placeholder}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {question.is_page && <Badge variant="secondary">Página</Badge>}
                            {question.is_time_limited && (
                              <Badge variant="outline">{question.time_limit} min</Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No hay preguntas disponibles</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}