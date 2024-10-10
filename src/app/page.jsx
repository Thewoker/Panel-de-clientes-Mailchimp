'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import moment from "moment"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  const [clientes, setClientes] = useState([])
  const [selectedEmail, setSelectedEmail] = useState("")
  const [name, setName] = useState("")
  const [birthday, setBirthday] = useState("")
  const [selectedFestivity, setSelectedFestivity] = useState("ba9d9bb3e9")
  const [festividades, setFestividades] = useState([{ id: "ba9d9bb3e9", name: "Festividad 1" }])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchClients = async () => {
      console.log("Fetching clients...")
      try {
        const { data } = await axios.get(`/api/mailchimp/${selectedFestivity}`)
        const festividades = await axios.get("/api/mailchimp")
        setClientes(data)
        setFestividades(festividades.data)
        setIsLoading(false)
      } catch (error) {
        toast.error("Error al obtener los clientes de Mailchimp")
        console.error("Error fetching clients:", error)
      }
    }

    fetchClients()
  }, [selectedFestivity])

  const handleAddToFestivityList = async () => {
    if (!selectedEmail || !selectedFestivity || !name || !birthday) {
      toast.warning("Por favor, complete todos los campos")
      return
    }

    const date = new Date(birthday)

    try {
      await axios.post(`/api/mailchimp/${selectedFestivity}`, {
        email: selectedEmail,
        name: name,
        birthday: date,
        listId: selectedFestivity,
      })
      toast.success("Cliente agregado a la lista de festividad")
      setSelectedEmail("")
      setName("")
      setBirthday("")
      setSelectedFestivity("")
    } catch (error) {
      toast.error("Error al agregar cliente a la lista")
      console.error("Error adding client to festivity list:", error)
    }
  }

  const eliminarSuscriptor = async (email, listId) => {
    try {
      const response = await axios.post('/api/mailchimp/deleteSubscriber', {
        email: email,
        listId: listId,
      })

      toast.success("Suscriptor eliminado de la lista")
      console.log(response.data.message)
    } catch (error) {
      console.error("Error eliminando al suscriptor:", error)
    }
  }

  return (
    <div className="p-4 bg-amber-50 min-h-screen">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Gestión de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedFestivity}
            onValueChange={(value) => setSelectedFestivity(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione una festividad" />
            </SelectTrigger>
            <SelectContent>
              {festividades.map((festividad) => (
                <SelectItem key={festividad.id} value={festividad.id}>
                  {festividad.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center">Cargando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Detonador</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.length > 0 ? (
                  clientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell>{cliente?.merge_fields?.FNAME || 'N/A'}</TableCell>
                      <TableCell>{moment(cliente?.merge_fields?.BREAKPOINT).format('DD/MM/YYYY') || 'N/A'}</TableCell>
                      <TableCell>{cliente?.email_address}</TableCell>
                      <TableCell>
                        <form onSubmit={() => eliminarSuscriptor(cliente.email_address, selectedFestivity)}>
                          <Button
                            variant="destructive"
                            size="sm"
                            type="submit"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No hay clientes disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agregar Nuevo Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddToFestivityList} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email del cliente
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Ingrese el email"
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Nombre del cliente
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Ingrese el nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="birthday">
                Fecha de detonación
              </label>
              <Input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Agregar a lista de festividad
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}